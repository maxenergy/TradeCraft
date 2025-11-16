# TradeCraft 常见问题（FAQ）

本文档整理了开发过程中的常见问题和解决方案。

---

## 📚 目录

- [环境配置](#环境配置)
- [数据库相关](#数据库相关)
- [后端开发](#后端开发)
- [前端开发](#前端开发)
- [AI服务](#ai服务)
- [支付集成](#支付集成)
- [部署相关](#部署相关)
- [性能优化](#性能优化)

---

## 🔧 环境配置

### Q1: Docker容器启动失败怎么办？

**症状**：`docker-compose up` 失败

**解决方案**：

```bash
# 1. 检查Docker是否运行
docker ps

# 2. 检查端口占用
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# 3. 清理旧容器和数据
docker-compose down -v
docker system prune -a

# 4. 重新启动
docker-compose up -d
```

### Q2: Java 17安装后mvn命令无法识别？

**症状**：`JAVA_HOME not set`

**解决方案**：

**macOS**:
```bash
# 安装Java 17
brew install openjdk@17

# 设置JAVA_HOME
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc

# 验证
java -version
```

**Ubuntu**:
```bash
sudo apt install openjdk-17-jdk
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

**Windows**:
1. 下载JDK 17安装包
2. 设置系统环境变量：
   - `JAVA_HOME`: `C:\Program Files\Java\jdk-17`
   - `Path`: 添加 `%JAVA_HOME%\bin`

### Q3: Node.js版本不对怎么办？

**建议使用nvm管理Node.js版本**：

```bash
# 安装nvm（macOS/Linux）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# 验证
node -v  # 应该显示 v18.x.x
```

---

## 💾 数据库相关

### Q4: Flyway迁移失败：Checksum mismatch

**症状**：
```
Migration checksum mismatch for migration version 1
```

**原因**：迁移文件被修改

**解决方案**：

**方法1：修复checksum（开发环境）**
```bash
# 删除flyway_schema_history表
docker exec -it tradecraft-db psql -U tradecraft -d tradecraft_dev -c "DROP TABLE flyway_schema_history;"

# 重新运行迁移
./mvnw flyway:migrate
```

**方法2：手动修复（生产环境）**
```sql
-- 更新checksum
UPDATE flyway_schema_history
SET checksum = <new_checksum>
WHERE version = '1';
```

### Q5: PostgreSQL连接池耗尽

**症状**：
```
HikariPool: Connection is not available, request timed out after 30000ms
```

**解决方案**：

**application.yml**:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20      # 增加连接池大小
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

**检查连接泄漏**：
```java
// 确保使用@Transactional
@Transactional(readOnly = true)
public List<Product> getProducts() {
    return productRepository.findAll();
}
```

### Q6: 如何查看数据库表结构？

```bash
# 进入PostgreSQL容器
docker exec -it tradecraft-db psql -U tradecraft -d tradecraft_dev

# 查看所有表
\dt

# 查看表结构
\d products

# 查看索引
\di

# 退出
\q
```

---

## 🔨 后端开发

### Q7: Lombok注解不生效

**症状**：`@Getter`, `@Setter` 等注解无法识别

**解决方案**：

**IntelliJ IDEA**:
1. 安装Lombok插件
2. Settings → Build, Execution, Deployment → Compiler → Annotation Processors
3. 勾选 "Enable annotation processing"
4. 重启IDE

**VS Code**:
安装Java Extension Pack

### Q8: MapStruct生成的实现类找不到

**症状**：
```
Cannot resolve symbol 'ProductMapperImpl'
```

**解决方案**：

```bash
# 重新编译
./mvnw clean compile

# 检查target目录
ls target/generated-sources/annotations/com/tradecraft/ecommerce/mapper/
```

**pom.xml配置检查**：
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.11.0</version>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.5.5.Final</version>
            </path>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.30</version>
            </path>
            <!-- Lombok和MapStruct一起使用 -->
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok-mapstruct-binding</artifactId>
                <version>0.2.0</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

### Q9: JWT Token过期时间如何配置？

**application.yml**:
```yaml
jwt:
  secret: your-secret-key-at-least-32-characters-long
  expiration: 86400000  # 24小时（毫秒）
  refresh-expiration: 604800000  # 7天（毫秒）
```

### Q10: 如何处理跨域（CORS）问题？

**WebConfig.java**:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

---

## 🎨 前端开发

### Q11: Next.js页面404错误

**症状**：访问页面显示404

**检查清单**：
1. 文件路径是否正确（App Router使用 `app/` 目录）
2. 文件名是否为 `page.tsx`
3. 是否导出了default函数

**正确示例**：
```typescript
// app/products/page.tsx
export default function ProductsPage() {
  return <div>Products</div>;
}
```

### Q12: Tailwind CSS样式不生效

**解决方案**：

**检查 tailwind.config.ts**:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

**检查 app/globals.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**重启开发服务器**：
```bash
npm run dev
```

### Q13: TypeScript类型错误

**症状**：
```
Property 'xxx' does not exist on type 'YYY'
```

**解决方案**：

1. **定义接口**：
```typescript
// types/product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  // ...
}
```

2. **使用类型断言**（临时）：
```typescript
const product = data as Product;
```

3. **修复API响应类型**：
```typescript
const response = await fetch('/api/products');
const data: Product[] = await response.json();
```

### Q14: Zustand状态不持久化

**解决方案**：

使用persist中间件：

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      // ...
    }),
    {
      name: 'cart-storage', // localStorage key
      partialize: (state) => ({
        cart: state.cart,  // 只持久化cart
      }),
    }
  )
);
```

### Q15: next-intl语言切换不生效

**检查中间件配置**：

**middleware.ts**:
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh-CN', 'id'],
  defaultLocale: 'en',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
```

**检查布局**:
```typescript
// app/[locale]/layout.tsx
export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🤖 AI服务

### Q16: 文心一言API调用失败

**症状**：
```
AuthenticationError: Invalid API key
```

**解决方案**：

1. **检查API Key**：
```bash
# .env
WENXIN_API_KEY=your_api_key
WENXIN_SECRET_KEY=your_secret_key
```

2. **获取Access Token**：
```python
import requests

url = "https://aip.baidubce.com/oauth/2.0/token"
params = {
    "grant_type": "client_credentials",
    "client_id": WENXIN_API_KEY,
    "client_secret": WENXIN_SECRET_KEY
}

response = requests.post(url, params=params)
access_token = response.json()["access_token"]
```

3. **检查余额**：登录百度智能云控制台查看剩余配额

### Q17: AI生成内容质量不佳

**优化Prompt**：

**差**：
```python
prompt = f"生成商品描述：{product_name}"
```

**好**：
```python
prompt = f"""
请为以下跨境电商商品生成专业的中文描述：

商品名称：{product_name}
商品类别：{category}
核心特点：{', '.join(features)}
目标受众：东南亚消费者

要求：
1. 突出商品核心卖点
2. 语言简洁专业
3. 包含使用场景
4. 字数150-200字
5. 格式化为段落
"""
```

### Q18: 翻译API超时

**解决方案**：

**增加超时时间**：
```python
# translator.py
import httpx

async def translate(text: str, target_lang: str):
    async with httpx.AsyncClient(timeout=30.0) as client:  # 30秒超时
        response = await client.post(url, json=payload)
        return response.json()
```

**添加重试机制**：
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
async def translate_with_retry(text: str, target_lang: str):
    return await translate(text, target_lang)
```

---

## 💳 支付集成

### Q19: Stripe测试支付失败

**测试卡号**：
```
成功: 4242 4242 4242 4242
失败: 4000 0000 0000 0002
需要3D验证: 4000 0025 0000 3155
```

**有效期**：任何未来日期（如 12/34）
**CVC**：任意3位数字（如 123）
**邮编**：任意5位数字（如 12345）

### Q20: PayPal沙箱环境配置

**步骤**：
1. 访问 https://developer.paypal.com
2. Dashboard → Sandbox → Accounts
3. 创建Business账号和Personal账号
4. 获取REST API凭证

**配置**：
```bash
# .env
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_secret
PAYPAL_MODE=sandbox
```

### Q21: Webhook未接收到事件

**检查清单**：

1. **Webhook URL可公网访问**：
   - 开发环境使用ngrok：`ngrok http 8080`
   - Webhook URL: `https://your-ngrok-url.ngrok.io/api/v1/payments/stripe/webhook`

2. **验证签名**：
```java
String payload = request.getBody();
String sigHeader = request.getHeader("Stripe-Signature");

Event event = Webhook.constructEvent(
    payload,
    sigHeader,
    webhookSecret
);
```

3. **返回200状态码**：
```java
@PostMapping("/webhook")
public ResponseEntity<String> handleWebhook(...) {
    // 处理事件
    return ResponseEntity.ok("success");
}
```

---

## 🚀 部署相关

### Q22: Docker镜像构建失败

**症状**：
```
ERROR [internal] load metadata for docker.io/library/node:18-alpine
```

**解决方案**：

**检查网络**：
```bash
# 使用国内镜像
docker pull registry.cn-hangzhou.aliyuncs.com/library/node:18-alpine
```

**多阶段构建优化**：

**Dockerfile.prod**:
```dockerfile
# 第一阶段：构建
FROM maven:3.8-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# 第二阶段：运行
FROM openjdk:17-jre-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Q23: Nginx反向代理502错误

**症状**：
```
502 Bad Gateway
```

**检查后端服务**：
```bash
# 检查容器状态
docker-compose ps

# 检查后端健康
curl http://localhost:8080/api/v1/health

# 查看后端日志
docker-compose logs backend
```

**检查Nginx配置**：
```nginx
upstream backend {
    server backend:8080;  # 使用容器名而不是localhost
}
```

### Q24: SSL证书配置

**使用Let's Encrypt**：

```bash
# 安装Certbot
sudo apt-get install certbot

# 获取证书
sudo certbot certonly --standalone -d yourdomain.com

# 证书位置
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

**Nginx配置**：
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

**自动续期**：
```bash
# Crontab
0 0 1 * * certbot renew --quiet && docker-compose restart nginx
```

---

## ⚡ 性能优化

### Q25: 数据库查询慢

**诊断**：

```sql
-- 开启查询日志
ALTER SYSTEM SET log_min_duration_statement = 100;  -- 记录>100ms的查询

-- 查看慢查询
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;

-- 分析查询计划
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = 1;
```

**优化**：

1. **添加索引**：
```sql
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
```

2. **使用JOIN FETCH避免N+1**：
```java
@Query("SELECT p FROM Product p LEFT JOIN FETCH p.category WHERE p.id = :id")
Product findByIdWithCategory(@Param("id") Long id);
```

3. **分页查询**：
```java
Pageable pageable = PageRequest.of(page, size);
Page<Product> products = productRepository.findAll(pageable);
```

### Q26: 前端首屏加载慢

**优化**：

1. **图片优化**：
```typescript
import Image from 'next/image';

<Image
  src="/product.jpg"
  width={400}
  height={300}
  alt="Product"
  loading="lazy"  // 懒加载
  quality={75}     // 压缩质量
/>
```

2. **代码分割**：
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false,  // 禁用SSR
});
```

3. **字体优化**：
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // 字体交换
});
```

### Q27: Redis缓存命中率低

**监控**：
```bash
docker exec -it tradecraft-redis redis-cli info stats
# keyspace_hits:1000
# keyspace_misses:100
# 命中率 = hits / (hits + misses) = 90.9%
```

**优化TTL**：
```java
// 热点商品缓存24小时
@Cacheable(value = "hot-products", key = "#id")
@CacheEvict(value = "hot-products", allEntries = true,
            condition = "#result.viewCount > 1000")
public Product getProduct(Long id) { ... }
```

---

## 📞 更多帮助

### 仍然无法解决？

1. **查看详细文档**：
   - 技术设计：`tdd.md`
   - 开发计划：`DEVELOPMENT_PLAN_*.md`
   - 技术栈：`TECH_STACK.md`

2. **查看日志**：
```bash
# 后端日志
docker-compose logs -f backend

# 前端日志
npm run dev  # 终端输出

# 数据库日志
docker-compose logs -f db
```

3. **调试模式**：
```bash
# 后端
./mvnw spring-boot:run -Ddebug

# 前端
DEBUG=* npm run dev
```

4. **创建Issue**：
   - GitHub Issues
   - 详细描述问题
   - 附上错误日志
   - 说明环境信息

---

**文档版本**: v1.0
**最后更新**: 2025年11月16日
**维护者**: Claude Code

**提示**：本FAQ持续更新中，欢迎贡献更多问题和解决方案！
