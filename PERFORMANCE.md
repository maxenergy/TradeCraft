# 性能优化指南

本文档提供TradeCraft项目的性能优化建议和最佳实践。

## 目录

- [性能目标](#性能目标)
- [后端性能优化](#后端性能优化)
- [前端性能优化](#前端性能优化)
- [数据库性能优化](#数据库性能优化)
- [缓存策略](#缓存策略)
- [监控和诊断](#监控和诊断)

---

## 性能目标

### 关键指标

| 指标 | 目标 | 测量方法 |
|------|------|----------|
| 页面加载时间 (FCP) | < 1.5秒 | Lighthouse |
| 最大内容绘制 (LCP) | < 2.5秒 | Web Vitals |
| 首次输入延迟 (FID) | < 100ms | Web Vitals |
| 累积布局偏移 (CLS) | < 0.1 | Web Vitals |
| API响应时间 (p95) | < 500ms | APM工具 |
| 数据库查询时间 (p95) | < 100ms | pg_stat_statements |
| 并发用户支持 | 1000+ | 负载测试 |

---

## 后端性能优化

### 1. JVM调优

#### 推荐JVM参数

**生产环境 (4GB内存服务器)**:
```bash
JAVA_OPTS="
  -Xms2g
  -Xmx2g
  -XX:+UseG1GC
  -XX:MaxGCPauseMillis=200
  -XX:+UseStringDeduplication
  -XX:+ParallelRefProcEnabled
  -XX:+DisableExplicitGC
  -XX:MaxMetaspaceSize=512m
  -XX:+HeapDumpOnOutOfMemoryError
  -XX:HeapDumpPath=/var/log/tradecraft/
  -XX:+PrintGCDetails
  -XX:+PrintGCDateStamps
  -Xloggc:/var/log/tradecraft/gc.log
  -XX:+UseGCLogFileRotation
  -XX:NumberOfGCLogFiles=10
  -XX:GCLogFileSize=100M
"
```

**内存分配建议**:
- Heap: 容器内存的50-60%
- Metaspace: 256MB - 512MB
- 保留40%给操作系统和堆外内存

#### 监控GC

```bash
# 实时查看GC
jstat -gc <pid> 1000

# 查看GC统计
jstat -gcutil <pid>

# 查看堆内存
jmap -heap <pid>
```

### 2. 数据库连接池优化

#### HikariCP配置

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20  # CPU核心数 * 2 + 有效磁盘数
      minimum-idle: 5
      connection-timeout: 30000  # 30秒
      idle-timeout: 600000       # 10分钟
      max-lifetime: 1800000      # 30分钟
      leak-detection-threshold: 60000  # 1分钟
      pool-name: TradeCraft-HikariCP
```

**调优建议**:
```
最大连接数 = ((核心数 * 2) + 有效磁盘数)

示例：
- 4核CPU，1块SSD
- 最大连接数 = (4 * 2) + 1 = 9

实际生产建议：
- 开始值：核心数 * 2
- 监控并逐步调整
- 避免过大（降低数据库压力）
```

### 3. 查询优化

#### N+1查询问题

**❌ 错误示例**:
```java
// 会产生 N+1 查询
List<Order> orders = orderRepository.findByUserId(userId);
for (Order order : orders) {
    List<OrderItem> items = order.getItems(); // 每次都查询数据库
}
```

**✅ 正确示例**:
```java
// 使用JOIN FETCH一次性加载
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.user.id = :userId")
List<Order> findByUserIdWithItems(@Param("userId") Long userId);
```

#### 分页查询

```java
@Service
public class ProductService {

    // 使用Pageable进行分页
    public Page<Product> getProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
            Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.findAll(pageable);
    }

    // 游标分页（大数据集）
    public List<Product> getProductsCursor(Long lastId, int limit) {
        return productRepository.findByIdGreaterThanOrderByIdAsc(lastId,
            PageRequest.of(0, limit));
    }
}
```

### 4. 异步处理

#### 耗时操作异步化

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}

@Service
public class EmailService {

    @Async("taskExecutor")
    public CompletableFuture<Void> sendOrderConfirmation(Order order) {
        // 发送邮件（耗时操作）
        emailClient.send(order);
        return CompletableFuture.completedFuture(null);
    }
}
```

### 5. 响应压缩

```yaml
# application.yml
server:
  compression:
    enabled: true
    mime-types:
      - application/json
      - application/xml
      - text/html
      - text/xml
      - text/plain
      - text/css
      - application/javascript
    min-response-size: 1024  # 1KB
```

---

## 前端性能优化

### 1. 代码分割

#### 路由级别代码分割

```typescript
// app/products/page.tsx
import dynamic from 'next/dynamic';

// 动态导入，减少初始包大小
const ProductList = dynamic(() => import('@/components/ProductList'), {
  loading: () => <ProductListSkeleton />,
  ssr: false
});

export default function ProductsPage() {
  return <ProductList />;
}
```

#### 组件级别代码分割

```typescript
// 懒加载大组件
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Spinner />,
  ssr: false
});

// 条件加载
function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && <HeavyChart />}
    </div>
  );
}
```

### 2. 图片优化

#### Next.js Image组件

```typescript
import Image from 'next/image';

function ProductCard({ product }) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={300}
      height={300}
      placeholder="blur"
      blurDataURL={product.thumbnailUrl}
      loading="lazy"
      quality={75}  // 75%质量通常足够
    />
  );
}
```

#### 响应式图片

```typescript
<Image
  src={product.imageUrl}
  alt={product.name}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  fill
  style={{ objectFit: 'cover' }}
/>
```

### 3. 数据获取优化

#### SWR缓存策略

```typescript
import useSWR from 'swr';

function ProductList() {
  const { data, error } = useSWR(
    '/api/v1/products',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,  // 1分钟内去重
      focusThrottleInterval: 30000  // 30秒内不重新验证
    }
  );

  if (error) return <ErrorDisplay />;
  if (!data) return <Skeleton />;

  return <ProductGrid products={data} />;
}
```

#### 预取数据

```typescript
import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';

function ProductCard({ product }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const handleMouseEnter = () => {
    // 预取产品详情
    mutate(`/api/v1/products/${product.id}`,
      fetch(`/api/v1/products/${product.id}`).then(r => r.json())
    );
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      {/* 产品卡片内容 */}
    </div>
  );
}
```

### 4. 虚拟化长列表

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualProductList({ products }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,  // 预估每行高度
    overscan: 5  // 额外渲染的行数
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            <ProductCard product={products[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. 防抖和节流

```typescript
import { useDebouncedCallback } from 'use-debounce';

function SearchBar() {
  const [query, setQuery] = useState('');

  // 防抖搜索（300ms）
  const debouncedSearch = useDebouncedCallback(
    (value) => {
      // 执行搜索API调用
      searchProducts(value);
    },
    300
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input value={query} onChange={handleChange} />;
}
```

---

## 数据库性能优化

### 1. 索引策略

#### 查询分析

```sql
-- 启用查询统计
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 查看最慢的查询
SELECT
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- 查看缺失索引
SELECT
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1;
```

#### 创建有效索引

```sql
-- 单列索引
CREATE INDEX idx_products_category ON products(category_id);

-- 复合索引（注意顺序）
CREATE INDEX idx_products_cat_status_price ON products(category_id, status, price_cny);

-- 部分索引（仅索引活跃产品）
CREATE INDEX idx_active_products ON products(category_id)
WHERE status = 'ACTIVE';

-- 表达式索引
CREATE INDEX idx_products_lower_name ON products(LOWER(name_en));

-- 全文搜索索引
CREATE INDEX idx_products_fts ON products
USING gin(to_tsvector('english', name_en || ' ' || COALESCE(description_en, '')));
```

### 2. 查询优化

#### EXPLAIN ANALYZE

```sql
-- 分析查询计划
EXPLAIN ANALYZE
SELECT p.*, c.name_en as category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.status = 'ACTIVE'
  AND p.price_cny < 1000
ORDER BY p.created_at DESC
LIMIT 20;
```

**关注点**:
- **Seq Scan**: 全表扫描，考虑添加索引
- **Index Scan**: 使用索引，良好
- **Nested Loop**: 可能需要优化JOIN
- **Hash Join**: 大表JOIN，考虑添加索引
- **执行时间**: 比较 Planning Time vs Execution Time

#### 优化JOIN

```sql
-- ❌ 低效：多次子查询
SELECT *
FROM orders o
WHERE user_id IN (SELECT id FROM users WHERE status = 'ACTIVE')
  AND id IN (SELECT order_id FROM order_items WHERE quantity > 5);

-- ✅ 优化：使用JOIN
SELECT DISTINCT o.*
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
WHERE u.status = 'ACTIVE'
  AND oi.quantity > 5;
```

### 3. 分区表

对于大数据表（如订单），考虑分区：

```sql
-- 按月份分区订单表
CREATE TABLE orders_partitioned (
    LIKE orders INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- 创建分区
CREATE TABLE orders_2024_01 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE orders_2024_02 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- 自动创建未来分区（使用pg_partman扩展）
```

### 4. 数据库连接

#### 连接池

```yaml
# PostgreSQL配置
max_connections = 200
shared_buffers = 2GB  # 系统内存的25%
effective_cache_size = 6GB  # 系统内存的75%
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1  # SSD使用较低值
effective_io_concurrency = 200
work_mem = 10485kB  # 根据max_connections调整
min_wal_size = 1GB
max_wal_size = 4GB
```

---

## 缓存策略

### 1. Redis缓存

#### 多级缓存

```java
@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RedisTemplate<String, Product> redisTemplate;

    private final LoadingCache<Long, Product> localCache = Caffeine.newBuilder()
        .maximumSize(1000)
        .expireAfterWrite(5, TimeUnit.MINUTES)
        .build(key -> getProductFromRedisOrDb(key));

    public Product getProduct(Long id) {
        // Level 1: Local cache (Caffeine)
        return localCache.get(id);
    }

    private Product getProductFromRedisOrDb(Long id) {
        // Level 2: Redis cache
        String key = "product:" + id;
        Product product = redisTemplate.opsForValue().get(key);

        if (product == null) {
            // Level 3: Database
            product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            // 回写Redis (TTL: 1小时)
            redisTemplate.opsForValue().set(key, product, 1, TimeUnit.HOURS);
        }

        return product;
    }
}
```

#### 缓存失效策略

```java
@Service
public class ProductService {

    // 缓存穿透：布隆过滤器
    private final BloomFilter<Long> productIdFilter = BloomFilter.create(
        Funnels.longFunnel(),
        100000,  // 预期元素数量
        0.01     // 假阳性率
    );

    public Product getProduct(Long id) {
        // 检查ID是否可能存在
        if (!productIdFilter.mightContain(id)) {
            throw new ResourceNotFoundException("Product not found");
        }

        // 正常缓存逻辑
        return getFromCacheOrDb(id);
    }

    // 缓存雪崩：随机TTL
    private void cacheProduct(Product product) {
        long ttl = 3600 + ThreadLocalRandom.current().nextInt(600);  // 1小时 ± 10分钟
        redisTemplate.opsForValue().set("product:" + product.getId(),
            product, ttl, TimeUnit.SECONDS);
    }

    // 缓存击穿：分布式锁
    public Product getProductWithLock(Long id) {
        String key = "product:" + id;
        Product product = redisTemplate.opsForValue().get(key);

        if (product == null) {
            String lockKey = "lock:product:" + id;
            Boolean locked = redisTemplate.opsForValue()
                .setIfAbsent(lockKey, "1", 10, TimeUnit.SECONDS);

            if (Boolean.TRUE.equals(locked)) {
                try {
                    // 获取锁成功，查询数据库
                    product = productRepository.findById(id).orElse(null);
                    if (product != null) {
                        cacheProduct(product);
                    }
                } finally {
                    redisTemplate.delete(lockKey);
                }
            } else {
                // 获取锁失败，等待后重试
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                return getProductWithLock(id);  // 递归重试
            }
        }

        return product;
    }
}
```

### 2. HTTP缓存

#### 后端响应头

```java
@RestController
public class ProductController {

    @GetMapping("/api/v1/products/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        Product product = productService.getProduct(id);

        return ResponseEntity.ok()
            // 浏览器缓存5分钟，CDN缓存1小时
            .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES)
                .cachePublic()
                .sMaxAge(1, TimeUnit.HOURS))
            .eTag(String.valueOf(product.getUpdatedAt().hashCode()))
            .lastModified(product.getUpdatedAt().toInstant())
            .body(toResponse(product));
    }
}
```

#### CDN缓存

```nginx
# Nginx配置
location /api/v1/products {
    proxy_pass http://backend;

    # CDN缓存
    proxy_cache products_cache;
    proxy_cache_valid 200 1h;
    proxy_cache_valid 404 5m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    proxy_cache_bypass $http_cache_control;

    add_header X-Cache-Status $upstream_cache_status;
}
```

---

## 监控和诊断

### 1. APM监控

#### Spring Boot Actuator

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true
```

#### 自定义指标

```java
@Component
public class CustomMetrics {

    private final Counter orderCounter;
    private final Timer productSearchTimer;

    public CustomMetrics(MeterRegistry meterRegistry) {
        this.orderCounter = meterRegistry.counter("orders.created.total");
        this.productSearchTimer = meterRegistry.timer("products.search.duration");
    }

    public void recordOrderCreated() {
        orderCounter.increment();
    }

    public <T> T timeProductSearch(Supplier<T> operation) {
        return productSearchTimer.record(operation);
    }
}
```

### 2. 日志分析

```java
@Slf4j
@Aspect
@Component
public class PerformanceLoggingAspect {

    @Around("@annotation(org.springframework.web.bind.annotation.GetMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PostMapping)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - start;

            if (executionTime > 1000) {  // 记录慢请求
                log.warn("Slow request: {} took {}ms",
                    joinPoint.getSignature(), executionTime);
            }

            return result;
        } catch (Throwable t) {
            log.error("Error in {}: {}",
                joinPoint.getSignature(), t.getMessage());
            throw t;
        }
    }
}
```

### 3. 负载测试

#### JMeter脚本示例

```xml
<!-- 产品列表负载测试 -->
<ThreadGroup>
  <stringProp name="ThreadGroup.num_threads">100</stringProp>
  <stringProp name="ThreadGroup.ramp_time">10</stringProp>
  <stringProp name="ThreadGroup.duration">300</stringProp>
</ThreadGroup>

<HTTPSamplerProxy>
  <stringProp name="HTTPSampler.domain">api.tradecraft.com</stringProp>
  <stringProp name="HTTPSampler.path">/api/v1/products</stringProp>
  <stringProp name="HTTPSampler.method">GET</stringProp>
</HTTPSamplerProxy>
```

#### K6脚本

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // 上升到100用户
    { duration: '5m', target: 100 },  // 保持100用户
    { duration: '2m', target: 0 },    // 下降到0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95%请求<500ms
    http_req_failed: ['rate<0.01'],    // 错误率<1%
  },
};

export default function () {
  const res = http.get('https://api.tradecraft.com/api/v1/products');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

---

## 性能检查清单

### 部署前

- [ ] JVM参数已优化
- [ ] 数据库连接池已配置
- [ ] 所有查询已添加适当索引
- [ ] N+1查询已消除
- [ ] 图片已优化（WebP格式，适当尺寸）
- [ ] 代码已分割（路由和组件级别）
- [ ] 缓存策略已实施
- [ ] CDN已配置
- [ ] Gzip/Brotli压缩已启用
- [ ] 负载测试已通过

### 定期检查

- [ ] 审查慢查询日志
- [ ] 检查缓存命中率
- [ ] 监控内存使用
- [ ] 检查GC日志
- [ ] 分析Web Vitals指标
- [ ] 审查APM报告

---

**性能优化是持续的过程，需要定期监控和调整！**
