# 跨境电商AI自动化平台 MVP 技术设计文档（TDD）

**版本**: v1.0  
**创建日期**: 2025年11月16日  
**技术负责人**: 您（全栈工程师）  
**开发周期**: 3个月（12周）

---

## 一、系统架构设计

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层（Users）                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  买家端   │  │  卖家端   │  │  移动端   │  │  管理端   │   │
│  │(Buyer)  │  │ (Seller) │  │(Mobile) │  │ (Admin)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────┬────────────────────────────────────┬───────────┘
             │                                    │
             │            HTTPS / CDN             │
             │                                    │
┌────────────▼────────────────────────────────────▼───────────┐
│                      接入层（Gateway）                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Nginx Reverse Proxy + Load Balancer                │  │
│  │  - SSL Termination                                   │  │
│  │  - Rate Limiting                                     │  │
│  │  - Static File Serving                               │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────┬───────────┘
             │                                    │
    ┌────────▼────────┐              ┌───────────▼────────┐
    │  Next.js SSR    │              │  Spring Boot API   │
    │  (Frontend)     │              │  (Backend)         │
    │  - Server-Side  │◄─────────────┤  - RESTful API     │
    │    Rendering    │   API Calls  │  - Business Logic  │
    │  - i18n Routing │              │  - Data Validation │
    │  - SEO          │              │  - Authentication  │
    └────────┬────────┘              └──────────┬─────────┘
             │                                  │
             │                       ┌──────────▼─────────┐
             │                       │  FastAPI (Python)  │
             │                       │  - AI Services     │
             │                       │  - Image Process   │
             │                       │  - Translation     │
             │                       └──────────┬─────────┘
             │                                  │
┌────────────▼──────────────────────────────────▼───────────┐
│                      数据层（Data Layer）                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │PostgreSQL│  │  Redis   │  │   OSS    │  │  Search  │ │
│  │(主数据库) │  │  (缓存)   │  │ (存储)   │  │(Meili)   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
             │
┌────────────▼──────────────────────────────────────────────┐
│                    外部服务层（External Services）          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Stripe  │  │  PayPal  │  │ 17Track  │  │AI Models │ │
│  │(支付)    │  │ (支付)   │  │ (物流)   │  │(文心/GLM)│ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技术架构决策

**架构模式**: 模块化单体架构（Modular Monolith）

**理由**:
- ✅ MVP阶段流量低（日均100单），QPS仅1-2
- ✅ 一人开发，微服务架构增加复杂度和维护成本
- ✅ 模块化设计预留后期拆分为微服务的可能性
- ✅ 部署简单，成本低
- ✅ 事务处理简单（不需要分布式事务）

**何时升级到微服务**:
- 日均订单量 > 10,000（QPS > 10-20）
- 团队规模 > 10人
- 需要独立扩展某个模块（如AI服务）

---

## 二、技术栈详细说明

### 2.1 后端技术栈

#### Spring Boot 3.2（主业务服务）

**版本**: Spring Boot 3.2.x（基于Java 17）

**核心依赖**:
```xml
<dependencies>
    <!-- Spring Boot Core -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    
    <!-- Spring Data Redis -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    
    <!-- Spring Security + JWT -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Swagger/OpenAPI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.2.0</version>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    
    <!-- MapStruct (DTO Mapping) -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
</dependencies>
```

**项目结构**:
```
src/main/java/com/ecommerce/
├── config/                 # 配置类
│   ├── SecurityConfig.java
│   ├── RedisConfig.java
│   ├── SwaggerConfig.java
│   └── WebConfig.java
├── controller/             # 控制器（REST API）
│   ├── admin/              # 管理后台API
│   │   ├── ProductController.java
│   │   ├── OrderController.java
│   │   └── AnalyticsController.java
│   └── storefront/         # 前台API
│       ├── ProductController.java
│       ├── CartController.java
│       ├── CheckoutController.java
│       └── UserController.java
├── service/                # 业务逻辑层
│   ├── ProductService.java
│   ├── OrderService.java
│   ├── PaymentService.java
│   ├── AIContentService.java (调用FastAPI)
│   └── UserService.java
├── repository/             # 数据访问层
│   ├── ProductRepository.java
│   ├── OrderRepository.java
│   └── UserRepository.java
├── entity/                 # 数据实体
│   ├── Product.java
│   ├── Order.java
│   ├── User.java
│   └── ...
├── dto/                    # 数据传输对象
│   ├── request/
│   └── response/
├── exception/              # 异常处理
│   ├── GlobalExceptionHandler.java
│   └── CustomException.java
├── security/               # 安全相关
│   ├── JwtTokenProvider.java
│   └── UserDetailsServiceImpl.java
├── util/                   # 工具类
│   ├── FileUtil.java
│   └── DateUtil.java
└── EcommerceApplication.java
```

#### FastAPI（AI服务）

**版本**: FastAPI 0.109.x + Python 3.11

**核心依赖**（requirements.txt）:
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
python-dotenv==1.0.0
requests==2.31.0
pillow==10.2.0
langchain==0.1.0
openai==1.6.0
httpx==0.26.0
redis==5.0.0
```

**项目结构**:
```
fastapi-ai-service/
├── main.py                    # FastAPI应用入口
├── routers/                   # 路由
│   ├── content_generation.py
│   ├── image_processing.py
│   └── translation.py
├── services/                  # 业务逻辑
│   ├── ai_client.py           # AI客户端（文心一言、GLM-4）
│   ├── translator.py          # 翻译服务
│   └── image_processor.py     # 图片处理
├── models/                    # Pydantic模型
│   ├── request.py
│   └── response.py
├── config/                    # 配置
│   └── settings.py
├── utils/                     # 工具类
│   └── cache.py               # Redis缓存
└── requirements.txt
```

**API端点示例**:
```python
# main.py
from fastapi import FastAPI
from routers import content_generation, translation

app = FastAPI(title="E-commerce AI Service")

app.include_router(content_generation.router, prefix="/api/v1")
app.include_router(translation.router, prefix="/api/v1")

# routers/content_generation.py
from fastapi import APIRouter
from models.request import ProductInfoRequest
from services.ai_client import generate_product_content

router = APIRouter()

@router.post("/generate-content")
async def generate_content(request: ProductInfoRequest):
    """
    生成商品多语言内容
    """
    content = await generate_product_content(
        product_name=request.product_name,
        category=request.category,
        features=request.features,
        target_languages=request.target_languages
    )
    return {"data": content}
```

---

### 2.2 前端技术栈

#### Next.js 14（React框架）

**版本**: Next.js 14.x (App Router)

**核心依赖**（package.json）:
```json
{
  "dependencies": {
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.3.3",
    
    "tailwindcss": "3.4.1",
    "@shadcn/ui": "latest",
    
    "zustand": "4.4.7",
    "react-hook-form": "7.49.3",
    "zod": "3.22.4",
    
    "axios": "1.6.5",
    "swr": "2.2.4",
    
    "next-intl": "3.4.5",
    "date-fns": "3.0.6",
    
    "@stripe/stripe-js": "2.4.0",
    "@paypal/react-paypal-js": "8.1.3"
  },
  "devDependencies": {
    "@types/node": "20.10.7",
    "@types/react": "18.2.47",
    "eslint": "8.56.0",
    "eslint-config-next": "14.1.0",
    "prettier": "3.1.1",
    "autoprefixer": "10.4.16",
    "postcss": "8.4.33"
  }
}
```

**项目结构**:
```
nextjs-storefront/
├── app/                       # Next.js App Router
│   ├── [locale]/              # 多语言路由
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   ├── products/          # 商品相关页面
│   │   │   ├── page.tsx       # 商品列表页
│   │   │   └── [id]/
│   │   │       └── page.tsx   # 商品详情页
│   │   ├── cart/
│   │   │   └── page.tsx       # 购物车页
│   │   ├── checkout/
│   │   │   └── page.tsx       # 结账页
│   │   ├── order/
│   │   │   ├── confirmation/
│   │   │   │   └── page.tsx   # 订单确认页
│   │   │   └── [id]/
│   │   │       └── page.tsx   # 订单详情页
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx   # 登录页
│   │       └── register/
│   │           └── page.tsx   # 注册页
│   ├── admin/                 # 管理后台
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Dashboard
│   │   ├── products/
│   │   │   ├── page.tsx       # 商品列表
│   │   │   ├── add/
│   │   │   │   └── page.tsx   # 添加商品
│   │   │   └── [id]/edit/
│   │   │       └── page.tsx   # 编辑商品
│   │   └── orders/
│   │       ├── page.tsx       # 订单列表
│   │       └── [id]/
│   │           └── page.tsx   # 订单详情
│   └── api/                   # API路由（Next.js API）
│       ├── auth/
│       └── webhook/
│           └── stripe/
│               └── route.ts   # Stripe Webhook
├── components/                # React组件
│   ├── ui/                    # Shadcn UI组件
│   ├── layout/                # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── product/               # 商品相关组件
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ProductFilter.tsx
│   ├── cart/
│   │   └── CartItem.tsx
│   └── checkout/
│       ├── ShippingForm.tsx
│       └── PaymentForm.tsx
├── lib/                       # 工具库
│   ├── api.ts                 # API客户端
│   ├── auth.ts                # 认证工具
│   ├── currency.ts            # 货币转换
│   └── validation.ts          # 表单验证
├── store/                     # Zustand状态管理
│   ├── cartStore.ts
│   ├── userStore.ts
│   └── settingsStore.ts
├── types/                     # TypeScript类型定义
│   ├── product.ts
│   ├── order.ts
│   └── user.ts
├── messages/                  # 多语言翻译文件
│   ├── en.json
│   ├── id.json                # 印尼语
│   ├── my.json                # 马来语
│   ├── zh-CN.json             # 简体中文
│   └── zh-TW.json             # 繁体中文
├── public/                    # 静态文件
│   ├── images/
│   └── icons/
├── styles/
│   └── globals.css
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

**Next.js配置（next.config.js）**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 多语言配置
  i18n: {
    locales: ['en', 'id', 'my', 'zh-CN', 'zh-TW'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  
  // 图片优化
  images: {
    domains: ['your-oss-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  
  // 生产优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
```

---

### 2.3 数据库技术栈

#### PostgreSQL 15

**版本**: PostgreSQL 15.x

**连接配置**:
```yaml
# application.yml (Spring Boot)
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ecommerce
    username: ecommerce_user
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  flyway:
    enabled: true
    locations: classpath:db/migration
```

**数据库迁移工具**: Flyway

**为什么选择PostgreSQL**:
- ✅ 强大的JSON支持（存储多语言内容）
- ✅ 全文搜索能力（tsvector）
- ✅ 成熟稳定，社区活跃
- ✅ 支持复杂查询和事务
- ✅ 免费开源

#### Redis 7.2

**用途**:
- Session存储（用户登录状态）
- 数据缓存（热门商品、分类）
- 分布式锁（防止超卖）
- 消息队列（异步任务，如AI生成）
- 限流（API Rate Limiting）

**Redis Key设计规范**:
```
# Session
session:{user_id} -> {user_info_json}  TTL: 7天

# 商品缓存
product:{product_id} -> {product_json}  TTL: 1小时
product:list:{category_id}:{page} -> {product_list_json}  TTL: 10分钟

# 购物车
cart:{user_id} -> {cart_items_json}  TTL: 30天

# 汇率缓存
currency:rate:{from}:{to} -> {rate}  TTL: 1小时

# AI生成任务队列
queue:ai_generation -> List[{task_json}]

# 限流
ratelimit:api:{ip}:{endpoint} -> {count}  TTL: 1分钟
```

---

### 2.4 存储与CDN

#### 阿里云OSS（对象存储）

**用途**:
- 商品图片存储
- 用户头像存储
- 数据库备份文件

**OSS Bucket配置**:
```
Bucket名称: ecommerce-assets
区域: 新加坡（靠近东南亚）
读写权限: 公共读，私有写
CDN加速: 开启
图片处理: 开启（自动压缩、格式转换、缩略图）
```

**图片上传流程**:
1. 前端获取签名URL（从Spring Boot后端）
2. 直接上传到OSS（不经过后端，节省带宽）
3. OSS返回图片URL
4. 前端保存URL到数据库

**Spring Boot OSS集成**:
```java
@Service
public class OssService {
    
    @Value("${aliyun.oss.endpoint}")
    private String endpoint;
    
    @Value("${aliyun.oss.bucket}")
    private String bucketName;
    
    private OSS ossClient;
    
    @PostConstruct
    public void init() {
        ossClient = new OSSClientBuilder().build(
            endpoint, 
            accessKeyId, 
            accessKeySecret
        );
    }
    
    public String generatePresignedUrl(String objectName) {
        Date expiration = new Date(System.currentTimeMillis() + 3600 * 1000);
        URL url = ossClient.generatePresignedUrl(
            bucketName, 
            objectName, 
            expiration
        );
        return url.toString();
    }
}
```

#### Cloudflare CDN（可选）

**用途**: 加速全球访问（特别是东南亚）

**配置**:
- 缓存静态资源（图片、CSS、JS）
- 启用Brotli压缩
- 启用HTTP/3（QUIC）

---

### 2.5 搜索引擎

#### Meilisearch（MVP）

**版本**: Meilisearch v1.5

**为什么选择Meilisearch**:
- ✅ 安装简单（单二进制文件，5分钟部署）
- ✅ 开箱即用（不需要复杂配置）
- ✅ 搜索速度快（< 50ms）
- ✅ 多语言支持（包括中文、印尼语、马来语）
- ✅ 免费开源
- ✅ REST API简单易用

**部署方式**:
```bash
# Docker方式（推荐）
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v1.5
```

**索引设计**:
```json
// products索引
{
  "uid": "products",
  "primaryKey": "id",
  "searchableAttributes": [
    "name_en",
    "name_id",
    "name_my",
    "name_zh_cn",
    "name_zh_tw",
    "description_en",
    "category"
  ],
  "filterableAttributes": [
    "category",
    "price",
    "stock_status",
    "created_at"
  ],
  "sortableAttributes": [
    "price",
    "created_at",
    "sales_count"
  ]
}
```

**Spring Boot集成**:
```java
@Service
public class SearchService {
    
    private final Client meilisearchClient;
    
    public SearchService() {
        Config config = new Config("http://localhost:7700", "masterKey");
        this.meilisearchClient = new Client(config);
    }
    
    public void indexProduct(Product product) throws Exception {
        Index index = meilisearchClient.index("products");
        
        Map<String, Object> document = new HashMap<>();
        document.put("id", product.getId());
        document.put("name_en", product.getNameEn());
        document.put("name_id", product.getNameId());
        // ... 其他字段
        
        index.addDocuments(new Gson().toJson(Arrays.asList(document)));
    }
    
    public List<Product> search(String query, String locale) {
        Index index = meilisearchClient.index("products");
        
        SearchRequest searchRequest = new SearchRequest(query)
            .setLimit(20)
            .setAttributesToSearchOn(new String[]{"name_" + locale});
        
        Searchable results = index.search(searchRequest);
        // 解析结果并返回
    }
}
```

**扩展计划**: 当SKU > 10,000或搜索QPS > 100时，迁移到Elasticsearch

---

## 三、数据库设计

### 3.1 ER图（实体关系图）

```
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│   Product   │───1:N──│   OrderItem │───N:1──│    Order    │
│             │        │             │        │             │
│ - id        │        │ - id        │        │ - id        │
│ - name_*    │        │ - product_id│        │ - user_id   │
│ - category  │        │ - order_id  │        │ - status    │
│ - price_cny │        │ - quantity  │        │ - total     │
│ - stock     │        │ - price     │        └─────────────┘
└─────────────┘        └─────────────┘               │
                                                      │ N:1
                                                      ▼
                                              ┌─────────────┐
                                              │    User     │
                                              │             │
                                              │ - id        │
                                              │ - email     │
                                              │ - password  │
                                              │ - role      │
                                              └─────────────┘
```

### 3.2 核心表设计

#### 3.2.1 用户表（users）

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt哈希
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'BUYER',  -- BUYER, SELLER, ADMIN
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, SUSPENDED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

#### 3.2.2 用户资料表（user_profiles）

```sql
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    language VARCHAR(10) DEFAULT 'en',  -- en, id, my, zh-CN, zh-TW
    currency VARCHAR(10) DEFAULT 'USD',  -- USD, IDR, MYR, CNY
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

#### 3.2.3 收货地址表（addresses）

```sql
CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(10) NOT NULL,  -- ID, MY
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    address_line VARCHAR(500) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
```

#### 3.2.4 商品分类表（categories）

```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT REFERENCES categories(id),  -- 支持二级分类
    name_en VARCHAR(100) NOT NULL,
    name_id VARCHAR(100) NOT NULL,
    name_my VARCHAR(100) NOT NULL,
    name_zh_cn VARCHAR(100) NOT NULL,
    name_zh_tw VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
```

#### 3.2.5 商品表（products）

```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    sku VARCHAR(100) UNIQUE NOT NULL,  -- 自动生成，如 PROD-20251116-001
    
    -- 多语言名称
    name_en VARCHAR(255) NOT NULL,
    name_id VARCHAR(255) NOT NULL,
    name_my VARCHAR(255) NOT NULL,
    name_zh_cn VARCHAR(255) NOT NULL,
    name_zh_tw VARCHAR(255) NOT NULL,
    
    -- 多语言描述（富文本）
    description_en TEXT,
    description_id TEXT,
    description_my TEXT,
    description_zh_cn TEXT,
    description_zh_tw TEXT,
    
    -- 多语言卖点（JSON数组，如 ["卖点1", "卖点2"]）
    features_en JSONB,
    features_id JSONB,
    features_my JSONB,
    features_zh_cn JSONB,
    features_zh_tw JSONB,
    
    -- 多语言SEO
    seo_title_en VARCHAR(255),
    seo_title_id VARCHAR(255),
    seo_description_en TEXT,
    seo_description_id TEXT,
    keywords_en JSONB,  -- ["keyword1", "keyword2"]
    keywords_id JSONB,
    
    -- 定价（基准货币：人民币）
    price_cny DECIMAL(10, 2) NOT NULL,
    cost_price_cny DECIMAL(10, 2) NOT NULL,
    
    -- 库存
    stock INT NOT NULL DEFAULT 0,
    stock_alert_threshold INT DEFAULT 10,
    
    -- 图片（JSON数组，如 ["url1", "url2"]）
    images JSONB NOT NULL,  -- {main: "url", gallery: ["url1", "url2"]}
    
    -- 物流信息
    weight_grams INT,  -- 重量（克）
    dimensions JSONB,  -- {length: 10, width: 5, height: 3}（厘米）
    is_fragile BOOLEAN DEFAULT FALSE,
    requires_halal_cert BOOLEAN DEFAULT FALSE,  -- 是否需要清真认证
    
    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',  -- DRAFT, PUBLISHED, ARCHIVED
    
    -- 统计
    sales_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price_cny ON products(price_cny);

-- 全文搜索索引（PostgreSQL）
CREATE INDEX idx_products_name_en_fts ON products 
    USING gin(to_tsvector('english', name_en));
CREATE INDEX idx_products_name_id_fts ON products 
    USING gin(to_tsvector('indonesian', name_id));
```

#### 3.2.6 商品SKU表（product_skus）

用于多规格商品（如：颜色×尺寸）

```sql
CREATE TABLE product_skus (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,  -- SKU-001-RED-L
    
    -- 规格属性（JSON，如 {color: "红色", size: "L"}）
    attributes JSONB NOT NULL,
    
    -- 定价（可选，如果SKU价格与主商品不同）
    price_cny DECIMAL(10, 2),
    
    -- 库存
    stock INT NOT NULL DEFAULT 0,
    
    -- 图片（可选，SKU专属图片）
    image_url VARCHAR(500),
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_skus_product_id ON product_skus(product_id);
CREATE INDEX idx_product_skus_sku ON product_skus(sku);
```

#### 3.2.7 订单表（orders）

```sql
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,  -- ORD-20251116-001
    user_id BIGINT NOT NULL REFERENCES users(id),
    
    -- 收货信息
    shipping_recipient VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(50) NOT NULL,
    shipping_country VARCHAR(10) NOT NULL,
    shipping_province VARCHAR(100) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_address VARCHAR(500) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    
    -- 金额（订单货币）
    currency VARCHAR(10) NOT NULL,  -- USD, IDR, MYR, CNY
    subtotal DECIMAL(10, 2) NOT NULL,  -- 商品小计
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    cod_fee DECIMAL(10, 2) DEFAULT 0,  -- COD手续费
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,  -- 订单总额
    
    -- 支付信息
    payment_method VARCHAR(20) NOT NULL,  -- STRIPE, PAYPAL, COD
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING, PAID, FAILED, REFUNDED
    payment_transaction_id VARCHAR(255),  -- Stripe/PayPal交易ID
    paid_at TIMESTAMP,
    
    -- 配送信息
    shipping_method VARCHAR(20) NOT NULL,  -- STANDARD, EXPRESS
    shipping_carrier VARCHAR(50),  -- J&T, Ninja Van, etc.
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- 订单状态
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_PAYMENT',
    -- PENDING_PAYMENT（待支付）
    -- PAID（已支付/待发货）
    -- SHIPPED（已发货）
    -- COMPLETED（已完成）
    -- CANCELLED（已取消）
    -- REFUNDING（退款中）
    -- REFUNDED（已退款）
    
    -- 备注
    customer_note TEXT,
    seller_note TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

#### 3.2.8 订单项表（order_items）

```sql
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    product_sku_id BIGINT REFERENCES product_skus(id),  -- NULL表示单规格商品
    
    -- 商品快照（防止商品信息被修改）
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    product_image_url VARCHAR(500),
    sku_attributes JSONB,  -- SKU属性快照，如 {color: "红色", size: "L"}
    
    -- 价格数量
    price DECIMAL(10, 2) NOT NULL,  -- 下单时的价格
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,  -- price × quantity
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

#### 3.2.9 订单状态历史表（order_status_history）

```sql
CREATE TABLE order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    note TEXT,
    created_by BIGINT REFERENCES users(id),  -- 操作人（系统/卖家/买家）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
```

#### 3.2.10 购物车表（cart_items）

```sql
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_sku_id BIGINT REFERENCES product_skus(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, product_id, product_sku_id)
);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
```

---

### 3.3 数据库初始化脚本（Flyway）

**V1__Create_users_table.sql**:
```sql
-- 见上面的建表SQL
```

**V2__Insert_initial_data.sql**:
```sql
-- 插入初始分类
INSERT INTO categories (name_en, name_id, name_my, name_zh_cn, name_zh_tw, slug, parent_id) VALUES
('Electronics', 'Elektronik', 'Elektronik', '电子产品', '電子產品', 'electronics', NULL),
('Fashion', 'Fashion', 'Fesyen', '时尚服饰', '時尚服飾', 'fashion', NULL),
('Beauty', 'Kecantikan', 'Kecantikan', '美妆个护', '美妝個護', 'beauty', NULL),
('Home', 'Rumah & Taman', 'Rumah & Taman', '家居用品', '家居用品', 'home', NULL);

-- 插入测试用户（密码: password123，bcrypt哈希）
INSERT INTO users (email, password_hash, role) VALUES
('admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyAJ3oTpzcmm', 'ADMIN'),
('seller@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyAJ3oTpzcmm', 'SELLER'),
('buyer@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyAJ3oTpzcmm', 'BUYER');
```

---

## 四、API设计

### 4.1 API设计原则

**RESTful API**:
- 使用HTTP动词（GET, POST, PUT, DELETE）
- 资源命名复数（/api/v1/products）
- 版本化（/api/v1/）

**统一响应格式**:
```json
{
  "success": true,
  "data": {...},  // 或 []
  "message": "Operation successful",
  "timestamp": "2025-11-16T10:30:00Z"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 123 not found",
    "details": {...}
  },
  "timestamp": "2025-11-16T10:30:00Z"
}
```

**分页响应**:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 156,
      "totalPages": 8
    }
  }
}
```

---

### 4.2 核心API端点

#### 4.2.1 用户认证API

**POST /api/v1/auth/register** - 用户注册
```json
// Request
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "BUYER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**POST /api/v1/auth/login** - 用户登录
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "BUYER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**GET /api/v1/auth/me** - 获取当前用户信息
```
Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "BUYER",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "language": "en",
      "currency": "USD"
    }
  }
}
```

---

#### 4.2.2 商品管理API（管理后台）

**GET /api/v1/admin/products** - 获取商品列表
```
Query Params:
  page=1
  pageSize=20
  status=PUBLISHED (DRAFT, PUBLISHED, ARCHIVED)
  category=1
  search=keyword

Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "sku": "PROD-20251116-001",
        "nameEn": "Stainless Steel Water Bottle",
        "category": "Home",
        "priceCny": 89.00,
        "stock": 150,
        "status": "PUBLISHED",
        "images": {
          "main": "https://cdn.example.com/image1.jpg",
          "gallery": ["https://cdn.example.com/image2.jpg"]
        },
        "createdAt": "2025-11-16T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 156,
      "totalPages": 8
    }
  }
}
```

**POST /api/v1/admin/products** - 创建商品
```json
// Request
{
  "categoryId": 1,
  "nameZhCn": "不锈钢保温杯",
  "descriptionZhCn": "<p>高品质保温杯...</p>",
  "featuresZhCn": ["304不锈钢", "12小时保温"],
  "priceCny": 89.00,
  "costPriceCny": 35.00,
  "stock": 150,
  "images": {
    "main": "https://cdn.example.com/image1.jpg",
    "gallery": ["https://cdn.example.com/image2.jpg"]
  },
  "weight": 300,
  "dimensions": {"length": 20, "width": 8, "height": 8},
  "requiresHalalCert": false
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "sku": "PROD-20251116-001",
    "status": "DRAFT",
    ...
  },
  "message": "Product created successfully"
}
```

**POST /api/v1/admin/products/{id}/generate-content** - AI生成商品内容
```json
// Request
{
  "targetLanguages": ["en", "id", "my"],
  "targetMarket": "ID",  // ID（印尼）或 MY（马来西亚）
  "targetAudience": "adults",  // kids, teens, adults, seniors
  "useCase": "sports"  // office, outdoor, home, sports, etc.
}

// Response（异步，返回任务ID）
{
  "success": true,
  "data": {
    "taskId": "ai-task-123",
    "status": "PROCESSING",
    "estimatedTime": 60  // 秒
  },
  "message": "AI content generation started"
}
```

**GET /api/v1/admin/products/ai-tasks/{taskId}** - 查询AI生成任务状态
```json
// Response（进行中）
{
  "success": true,
  "data": {
    "taskId": "ai-task-123",
    "status": "PROCESSING",  // PENDING, PROCESSING, COMPLETED, FAILED
    "progress": 50  // 百分比
  }
}

// Response（完成）
{
  "success": true,
  "data": {
    "taskId": "ai-task-123",
    "status": "COMPLETED",
    "result": {
      "en": {
        "title": "Stainless Steel Water Bottle - Leak Proof...",
        "description": "<p>Stay hydrated with our premium...</p>",
        "features": ["304 Stainless Steel", "12h Insulation"],
        "seoTitle": "Buy 500ml Stainless Steel Water Bottle...",
        "seoDescription": "Best water bottle for sports...",
        "keywords": ["water bottle", "stainless steel", "insulated"]
      },
      "id": {
        "title": "Botol Minum Stainless Steel...",
        ...
      }
    }
  }
}
```

**PUT /api/v1/admin/products/{id}** - 更新商品

**DELETE /api/v1/admin/products/{id}** - 删除商品

---

#### 4.2.3 商品查询API（前台）

**GET /api/v1/storefront/products** - 获取商品列表（前台）
```
Query Params:
  page=1
  pageSize=20
  category=1
  minPrice=10
  maxPrice=100
  sort=price_asc (price_asc, price_desc, newest, popular)
  locale=en (en, id, my, zh-CN, zh-TW)

// Response
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "sku": "PROD-20251116-001",
        "name": "Stainless Steel Water Bottle",  // 根据locale返回
        "description": "Stay hydrated...",
        "price": 19.99,  // 根据用户选择的货币返回
        "currency": "USD",
        "images": {...},
        "inStock": true
      }
    ],
    "pagination": {...}
  }
}
```

**GET /api/v1/storefront/products/{id}** - 获取商品详情
```
Query Params:
  locale=en

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "sku": "PROD-20251116-001",
    "name": "Stainless Steel Water Bottle",
    "description": "<p>Stay hydrated...</p>",
    "features": ["304 Stainless Steel", "12h Insulation"],
    "price": 19.99,
    "currency": "USD",
    "images": {
      "main": "https://cdn.example.com/image1.jpg",
      "gallery": ["https://cdn.example.com/image2.jpg"]
    },
    "stock": 150,
    "skus": [  // 如果有多规格
      {
        "id": 1,
        "sku": "SKU-001-RED-L",
        "attributes": {"color": "Red", "size": "L"},
        "price": 19.99,
        "stock": 50,
        "image": "https://cdn.example.com/red.jpg"
      }
    ],
    "category": {
      "id": 1,
      "name": "Home"
    },
    "relatedProducts": [...]  // 相关推荐商品
  }
}
```

---

#### 4.2.4 购物车API

**GET /api/v1/cart** - 获取购物车
```
Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Stainless Steel Water Bottle",
          "price": 19.99,
          "image": "https://cdn.example.com/image1.jpg"
        },
        "sku": {
          "id": 1,
          "attributes": {"color": "Red", "size": "L"}
        },
        "quantity": 2,
        "subtotal": 39.98
      }
    ],
    "summary": {
      "itemCount": 2,
      "subtotal": 39.98,
      "currency": "USD"
    }
  }
}
```

**POST /api/v1/cart/items** - 加入购物车
```json
// Request
{
  "productId": 1,
  "skuId": 1,  // 可选，单规格商品为null
  "quantity": 2
}

// Response
{
  "success": true,
  "data": {
    "cartItemId": 1,
    "itemCount": 3  // 购物车总商品数
  },
  "message": "Added to cart"
}
```

**PUT /api/v1/cart/items/{id}** - 更新购物车商品数量
```json
// Request
{
  "quantity": 3
}
```

**DELETE /api/v1/cart/items/{id}** - 从购物车删除商品

---

#### 4.2.5 订单API

**POST /api/v1/orders** - 创建订单
```json
// Request
{
  "shippingAddress": {
    "recipientName": "John Doe",
    "phone": "+62812345678",
    "country": "ID",
    "province": "DKI Jakarta",
    "city": "Jakarta Selatan",
    "address": "Jl. Sudirman No. 123",
    "postalCode": "12190"
  },
  "shippingMethod": "STANDARD",  // STANDARD, EXPRESS
  "paymentMethod": "STRIPE",  // STRIPE, PAYPAL, COD
  "currency": "IDR",
  "items": [
    {
      "productId": 1,
      "skuId": 1,
      "quantity": 2
    }
  ],
  "customerNote": "Please pack carefully"
}

// Response
{
  "success": true,
  "data": {
    "orderId": 1,
    "orderNumber": "ORD-20251116-001",
    "total": 299000,
    "currency": "IDR",
    "paymentMethod": "STRIPE",
    "clientSecret": "pi_xxx_secret_xxx",  // Stripe支付用
    "redirectUrl": null  // PayPal跳转URL（如果选PayPal）
  },
  "message": "Order created successfully"
}
```

**GET /api/v1/orders** - 获取订单列表（买家）
```
Headers: Authorization: Bearer {token}

Query Params:
  page=1
  pageSize=20
  status=PAID

// Response
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "orderNumber": "ORD-20251116-001",
        "status": "SHIPPED",
        "total": 299000,
        "currency": "IDR",
        "createdAt": "2025-11-16T14:30:00Z",
        "items": [
          {
            "productName": "Stainless Steel Water Bottle",
            "quantity": 2,
            "price": 149500
          }
        ]
      }
    ],
    "pagination": {...}
  }
}
```

**GET /api/v1/orders/{id}** - 获取订单详情

**GET /api/v1/admin/orders** - 获取订单列表（卖家）

**PUT /api/v1/admin/orders/{id}/ship** - 标记为已发货
```json
// Request
{
  "shippingCarrier": "J&T Express",
  "trackingNumber": "JT123456789"
}
```

**POST /api/v1/admin/orders/{id}/cancel** - 取消订单

---

#### 4.2.6 支付Webhook API

**POST /api/v1/webhook/stripe** - Stripe Webhook
```
Headers:
  Stripe-Signature: xxx

Body: (Stripe事件JSON)

// Response
{
  "received": true
}
```

---

### 4.3 API认证与授权

**JWT Token格式**:
```json
{
  "sub": "1",  // 用户ID
  "email": "user@example.com",
  "role": "BUYER",
  "iat": 1700000000,
  "exp": 1700604800  // 7天后过期
}
```

**Spring Security配置**:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/storefront/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("SELLER")
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(
                jwtAuthenticationFilter(), 
                UsernamePasswordAuthenticationFilter.class
            );
        
        return http.build();
    }
}
```

---

## 五、AI服务集成方案

### 5.1 AI服务选型（基于成本优化）

| 服务商 | 模型 | 用途 | 价格 | 免费额度 | 备注 |
|--------|------|------|------|---------|------|
| 百度 | 文心一言 | 中文内容生成 | ¥0 | 完全免费 | MVP首选 |
| 智谱AI | GLM-4-Flash | 英文内容生成 | ¥0.001/K tokens | 大额免费 | 性价比极高 |
| 通义千问 | qwen-turbo | 多语言翻译 | ¥0.002/K tokens | 100万tokens/月 | 备选 |
| Azure | Translator | 翻译 | $10/M字符 | 200万字符/月 | 免费额度大 |
| Google | Translate API | 翻译 | $20/M字符 | 50万字符/月 | 语言最全 |

### 5.2 AI内容生成流程

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: 用户点击"AI生成内容"                                  │
│  - 前端: ProductForm组件                                      │
│  - 后端: POST /api/v1/admin/products/{id}/generate-content  │
└──────────────────┬───────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────┐
│  Step 2: Spring Boot创建异步任务                              │
│  - 生成taskId: ai-task-{uuid}                                │
│  - 发送任务到Redis队列: queue:ai_generation                   │
│  - 返回taskId给前端                                           │
└──────────────────┬───────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────┐
│  Step 3: FastAPI Worker从Redis队列取任务                      │
│  - 监听队列: queue:ai_generation                              │
│  - 取出任务: {productId, languages, market, ...}             │
└──────────────────┬───────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────┐
│  Step 4: 并行调用AI服务生成内容                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  生成中文内容（文心一言免费）                               │ │
│  │  Prompt: "角色：跨境电商文案专家。任务：为{product}生成..."  │ │
│  │  输出: {title, description, features, keywords}          │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  翻译为英语、印尼语、马来语                                 │ │
│  │  方案1: GLM-4直接生成英文（成本更低）                       │ │
│  │  方案2: Azure Translator翻译（免费额度大）                  │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────┬───────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────┐
│  Step 5: 质量检查与优化                                        │
│  - 敏感词过滤（禁售品类、违禁词）                               │
│  - 质量评分（长度、关键词密度、可读性）                          │
│  - 如果评分 < 85，标记需要人工审核                             │
└──────────────────┬───────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────┐
│  Step 6: 保存结果到Redis                                       │
│  - Key: ai_task:{taskId}                                     │
│  - Value: {status: "COMPLETED", result: {...}}               │
│  - TTL: 1小时                                                │
└──────────────────┬───────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────┐
│  Step 7: 前端轮询任务状态                                      │
│  - 每3秒调用: GET /api/v1/admin/products/ai-tasks/{taskId}   │
│  - 状态为COMPLETED时，显示结果给用户                            │
│  - 用户确认后，调用PUT /api/v1/admin/products/{id}更新商品     │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Prompt工程（文心一言）

**生成商品标题**:
```
你是一位专业的跨境电商文案专家，专注于东南亚市场（印尼、马来西亚）。

任务：为以下商品生成吸引人的标题。

商品信息：
- 中文名称：{name}
- 分类：{category}
- 核心特点：{features}

要求：
1. 标题长度：50-80字符
2. 必须包含：品牌（如有）+ 核心卖点 + 关键词
3. 语气：热情、直接，强调性价比
4. 目标人群：{targetAudience}

输出格式（JSON）：
{
  "titleZhCn": "标题内容",
  "explanation": "为什么这个标题吸引人"
}

示例：
不锈钢保温杯 → "500ml不锈钢保温杯 12小时保温保冷 防漏密封 运动水壶"
```

**生成商品描述**:
```
你是一位专业的跨境电商文案专家，专注于东南亚市场（印尼、马来西亚）。

任务：为以下商品生成详细的商品描述（长文）。

商品信息：
- 中文名称：{name}
- 分类：{category}
- 核心特点：{features}
- 目标市场：{market}
- 目标人群：{targetAudience}
- 使用场景：{useCase}

要求：
1. 总长度：300-500字
2. 结构：
   - 第1段（痛点+解决方案，50-80字）：先指出用户痛点，再说明本产品如何解决
   - 第2段（核心特点，100-150字）：详细介绍3-5个核心特点
   - 第3段（使用场景，80-120字）：描绘2-3个使用场景
   - 第4段（购买理由，50-80字）：总结购买理由，制造紧迫感
3. 语气：根据目标市场调整
   - 印尼：热情、直接、强调性价比、多用感叹号
   - 马来西亚：专业、可信、强调品质、温和说服
4. 避免：过度夸张、虚假承诺、违禁词

输出格式（JSON）：
{
  "descriptionZhCn": "<p>第1段</p><p>第2段</p>...",
  "keyPoints": ["要点1", "要点2", "要点3"]
}
```

**生成SEO关键词**:
```
你是一位专业的跨境电商SEO专家。

任务：为以下商品生成SEO关键词。

商品信息：
- 名称：{name}
- 分类：{category}
- 特点：{features}
- 目标市场：{market}

要求：
1. 数量：8-12个关键词
2. 类型组合：
   - 核心词（2-3个）：最直接描述商品的词，如"water bottle"
   - 长尾词（3-4个）：更具体的描述，如"stainless steel water bottle 500ml"
   - 本地化词（2-3个）：目标市场常用词，如"botol minum olahraga"（印尼语）
   - 品类词（1-2个）：如"drinkware", "sports accessories"
3. 避免：违禁词、品牌侵权词

输出格式（JSON）：
{
  "keywords": ["keyword1", "keyword2", ...],
  "categorized": {
    "core": ["..."],
    "longTail": ["..."],
    "localized": ["..."],
    "category": ["..."]
  }
}
```

### 5.4 FastAPI代码示例

**services/ai_client.py**:
```python
import os
from typing import List, Dict
import requests
from config.settings import settings

class AIClient:
    
    def __init__(self):
        self.wenxin_api_key = settings.WENXIN_API_KEY
        self.glm_api_key = settings.GLM_API_KEY
    
    async def generate_chinese_content(
        self, 
        product_name: str,
        category: str,
        features: List[str],
        market: str,
        target_audience: str,
        use_case: str
    ) -> Dict:
        """
        使用文心一言生成中文内容
        """
        prompt = f"""你是一位专业的跨境电商文案专家，专注于东南亚市场。

任务：为以下商品生成完整的营销内容。

商品信息：
- 中文名称：{product_name}
- 分类：{category}
- 核心特点：{', '.join(features)}
- 目标市场：{market}
- 目标人群：{target_audience}
- 使用场景：{use_case}

请生成以下内容（JSON格式）：
1. 标题（50-80字符）
2. 详细描述（300-500字，分4段）
3. 商品卖点（5-7个，每个10-20字）
4. SEO关键词（8-12个）
5. Meta描述（150-160字符）

输出JSON格式：
{{
  "title": "...",
  "description": "...",
  "features": ["...", "..."],
  "keywords": ["...", "..."],
  "metaDescription": "..."
}}
"""
        
        # 调用文心一言API
        response = requests.post(
            "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions",
            params={"access_token": self._get_access_token()},
            json={
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "response_format": {"type": "json_object"}
            }
        )
        
        result = response.json()
        content = json.loads(result["result"])
        
        return content
    
    async def translate_to_english(self, chinese_content: Dict) -> Dict:
        """
        将中文内容翻译为英文
        使用GLM-4-Flash（成本更低）
        """
        prompt = f"""Translate the following Chinese e-commerce product content to English.
Keep the marketing tone and style appropriate for Southeast Asian markets.

Chinese content:
{json.dumps(chinese_content, ensure_ascii=False, indent=2)}

Output the same JSON structure in English.
"""
        
        response = requests.post(
            "https://open.bigmodel.cn/api/paas/v4/chat/completions",
            headers={
                "Authorization": f"Bearer {self.glm_api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "glm-4-flash",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3
            }
        )
        
        result = response.json()
        english_content = json.loads(result["choices"][0]["message"]["content"])
        
        return english_content
    
    async def translate_via_azure(
        self, 
        text: str, 
        from_lang: str, 
        to_langs: List[str]
    ) -> Dict[str, str]:
        """
        使用Azure Translator翻译
        免费额度：200万字符/月
        """
        endpoint = "https://api.cognitive.microsofttranslator.com"
        path = "/translate"
        params = {
            "api-version": "3.0",
            "from": from_lang,
            "to": to_langs
        }
        
        headers = {
            "Ocp-Apim-Subscription-Key": settings.AZURE_TRANSLATOR_KEY,
            "Ocp-Apim-Subscription-Region": settings.AZURE_REGION,
            "Content-Type": "application/json"
        }
        
        body = [{"text": text}]
        
        response = requests.post(
            endpoint + path,
            params=params,
            headers=headers,
            json=body
        )
        
        result = response.json()
        
        translations = {}
        for translation in result[0]["translations"]:
            lang = translation["to"]
            translations[lang] = translation["text"]
        
        return translations
```

---

## 六、部署架构

### 6.1 开发环境（Docker Compose）

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: ecommerce-postgres
    environment:
      POSTGRES_DB: ecommerce
      POSTGRES_USER: ecommerce_user
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    container_name: ecommerce-redis
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
  
  meilisearch:
    image: getmeili/meilisearch:v1.5
    container_name: ecommerce-search
    ports:
      - "7700:7700"
    environment:
      MEILI_MASTER_KEY: masterKey123
    volumes:
      - meili_data:/meili_data
  
  spring-boot:
    build:
      context: ./spring-boot-api
      dockerfile: Dockerfile
    container_name: ecommerce-api
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ecommerce
      DB_USER: ecommerce_user
      DB_PASSWORD: password123
      REDIS_HOST: redis
      REDIS_PORT: 6379
      SEARCH_HOST: meilisearch
      SEARCH_PORT: 7700
    depends_on:
      - postgres
      - redis
      - meilisearch
  
  fastapi:
    build:
      context: ./fastapi-ai-service
      dockerfile: Dockerfile
    container_name: ecommerce-ai
    ports:
      - "8000:8000"
    environment:
      REDIS_URL: redis://redis:6379/0
      WENXIN_API_KEY: ${WENXIN_API_KEY}
      GLM_API_KEY: ${GLM_API_KEY}
    depends_on:
      - redis
  
  nextjs:
    build:
      context: ./nextjs-storefront
      dockerfile: Dockerfile
    container_name: ecommerce-frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080/api/v1
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${STRIPE_PUBLISHABLE_KEY}
    depends_on:
      - spring-boot

volumes:
  postgres_data:
  redis_data:
  meili_data:
```

---

### 6.2 生产环境（阿里云）

**服务器配置**（基于日均1000单）:

```
┌─────────────────────────────────────────────────────────────┐
│  阿里云ECS（应用服务器） × 3台                                 │
│  - 规格：ecs.c6.2xlarge（8核16G）                            │
│  - 价格：约¥1,700/台/月                                       │
│  - 部署：Docker + Docker Compose                            │
│    - Spring Boot API                                        │
│    - FastAPI AI Service                                     │
│    - Next.js (SSR)                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  阿里云RDS PostgreSQL（数据库）                               │
│  - 规格：rds.pg.s2.large（2核8G）                            │
│  - 存储：200GB SSD                                           │
│  - 主从复制：是                                               │
│  - 价格：约¥2,000/月                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  阿里云Redis（缓存）                                          │
│  - 规格：redis.master.small.default（1G内存）                │
│  - 价格：约¥300/月                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  阿里云SLB（负载均衡）                                        │
│  - 类型：应用型（ALB）                                        │
│  - 价格：约¥500/月                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  阿里云OSS（对象存储）                                        │
│  - 存储：5TB                                                 │
│  - 价格：约¥1,000/月                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  阿里云CDN（内容分发）                                        │
│  - 流量：15TB/月                                             │
│  - 价格：约¥3,000/月                                          │
└─────────────────────────────────────────────────────────────┘

总计：约¥15,800/月（¥189,600/年）
```

---

### 6.3 CI/CD流程（GitHub Actions）

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Java 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Build Spring Boot
        run: |
          cd spring-boot-api
          ./mvnw clean package -DskipTests
      
      - name: Build Docker images
        run: |
          docker build -t ecommerce-api:${{ github.sha }} ./spring-boot-api
          docker build -t ecommerce-ai:${{ github.sha }} ./fastapi-ai-service
          docker build -t ecommerce-frontend:${{ github.sha }} ./nextjs-storefront
      
      - name: Push to Aliyun Container Registry
        run: |
          docker login --username=${{ secrets.ALIYUN_DOCKER_USERNAME }} \
            --password=${{ secrets.ALIYUN_DOCKER_PASSWORD }} \
            registry.cn-singapore.aliyuncs.com
          
          docker tag ecommerce-api:${{ github.sha }} \
            registry.cn-singapore.aliyuncs.com/ecommerce/api:latest
          docker push registry.cn-singapore.aliyuncs.com/ecommerce/api:latest
          
          # 同样推送其他镜像...
      
      - name: Deploy to ECS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.ECS_HOST }}
          username: ${{ secrets.ECS_USER }}
          key: ${{ secrets.ECS_SSH_KEY }}
          script: |
            cd /opt/ecommerce
            docker-compose pull
            docker-compose up -d --force-recreate
            docker image prune -f
```

---

## 七、3个月开发计划（详细）

### Week 1-2: 项目启动与基础架构
- [ ] Day 1-2: 项目初始化
  - Git仓库创建（main, develop, feature分支）
  - Spring Boot项目初始化（pom.xml配置）
  - Next.js项目初始化（package.json配置）
  - FastAPI项目初始化（requirements.txt）
  - Docker开发环境搭建（docker-compose.yml）
  
- [ ] Day 3-5: 数据库设计
  - ER图设计
  - 编写Flyway迁移脚本（V1__Create_tables.sql）
  - 初始化测试数据
  - PostgreSQL索引优化
  
- [ ] Day 6-8: Spring Boot基础架构
  - Entity实体类（User, Product, Order等）
  - Repository接口
  - 全局异常处理（GlobalExceptionHandler）
  - 统一响应格式（ResponseWrapper）
  - JWT认证配置（SecurityConfig）
  
- [ ] Day 9-10: Next.js基础架构
  - 项目结构搭建（App Router）
  - Layout组件（Header, Footer）
  - 多语言配置（next-intl）
  - Tailwind CSS + Shadcn/ui集成
  - API客户端（lib/api.ts）

### Week 3-4: 商品管理模块
- [ ] Day 11-12: 商品CRUD后端
  - ProductService（业务逻辑）
  - ProductController（REST API）
  - 商品列表API（分页、筛选、排序）
  - 商品详情API
  
- [ ] Day 13-15: 商品管理前端（管理后台）
  - 商品列表页（/admin/products）
  - 商品添加页（/admin/products/add）
  - 表单组件（ProductForm）
  - 图片上传组件（ImageUploader）
  
- [ ] Day 16-17: 阿里云OSS集成
  - OssService（生成签名URL）
  - 前端直传OSS
  - 图片自动压缩和格式转换
  
- [ ] Day 18-19: AI内容生成后端
  - FastAPI项目搭建
  - 文心一言API集成
  - GLM-4 API集成
  - Azure Translator集成
  - Redis队列异步任务
  
- [ ] Day 20: AI内容生成前端
  - "AI生成"按钮和弹窗
  - 任务进度显示
  - 生成结果预览和编辑

### Week 5-6: 独立站前台基础
- [ ] Day 21-22: 首页开发
  - 导航栏（Header）
  - 轮播Banner
  - 热销商品（Featured Products）
  - 商品分类（Categories）
  - 页脚（Footer）
  
- [ ] Day 23-25: 商品列表页
  - 商品网格布局（ProductGrid）
  - 筛选侧边栏（ProductFilter）
  - 排序下拉框
  - 分页组件（Pagination）
  - 移动端适配（筛选抽屉）
  
- [ ] Day 26-28: 商品详情页
  - 图片画廊（Image Gallery）
  - 规格选择（VariantSelector）
  - 数量选择器（QuantitySelector）
  - "加入购物车"/"立即购买"按钮
  - 商品信息标签页（Description, Specs）
  - 相关推荐商品
  
- [ ] Day 29-30: 多语言多货币
  - 语言切换功能（Language Switcher）
  - 货币切换功能（Currency Switcher）
  - 汇率API集成（ExchangeRate-API）
  - 价格实时换算
  - Cookie保存用户偏好

### Week 7-8: 用户与订单模块
- [ ] Day 31-32: 用户认证后端
  - 用户注册API（/api/v1/auth/register）
  - 用户登录API（/api/v1/auth/login）
  - JWT Token生成和验证
  - 密码加密（bcrypt）
  
- [ ] Day 33-34: 用户认证前端
  - 注册页（/auth/register）
  - 登录页（/auth/login）
  - 表单验证（react-hook-form + zod）
  - Zustand状态管理（userStore）
  
- [ ] Day 35-36: 个人中心
  - 个人信息页（/account/profile）
  - 收货地址管理（/account/addresses）
  - 修改密码（/account/password）
  
- [ ] Day 37-38: 购物车
  - 购物车后端API
  - 购物车页面（/cart）
  - 购物车Zustand Store（cartStore）
  - 本地存储（localStorage）+ 服务器同步
  
- [ ] Day 39-40: 结账流程
  - 结账页（/checkout）
  - 收货地址表单（ShippingForm）
  - 配送方式选择
  - 订单摘要（OrderSummary）

### Week 9-10: 支付与物流集成
- [ ] Day 41-43: Stripe支付
  - Stripe Elements集成
  - PaymentIntent创建
  - 支付成功处理
  - Webhook接收和验证
  - 测试模式测试
  
- [ ] Day 44-45: PayPal支付
  - PayPal Smart Buttons集成
  - PayPal授权流程
  - 支付成功处理
  - 沙盒模式测试
  
- [ ] Day 46-47: COD支付
  - COD选项实现
  - COD手续费计算
  - 订单直接创建（跳过支付）
  
- [ ] Day 48-49: 订单管理后端
  - 订单创建API
  - 订单列表API（买家、卖家）
  - 订单详情API
  - 订单状态更新（发货、取消、退款）
  - 订单状态机（状态流转验证）
  
- [ ] Day 50: 订单管理前端
  - 订单确认页（/order/confirmation）
  - 订单列表页（/account/orders）
  - 订单详情页（/order/[id]）
  - 订单列表页（管理后台，/admin/orders）
  - 订单详情页（管理后台，/admin/orders/[id]）
  - 发货弹窗（ShippingModal）

### Week 11-12: 数据分析与测试上线
- [ ] Day 51-52: 销售报表
  - 核心指标计算（GMV、订单数、转化率）
  - 销售趋势图（Chart.js）
  - 商品销售排行
  - 报表Dashboard（/admin/dashboard）
  
- [ ] Day 53: Google Analytics集成
  - GA4追踪代码安装
  - 电子商务事件追踪
  - 测试验证
  
- [ ] Day 54-56: 全流程测试
  - 注册登录测试
  - 浏览商品测试
  - 加购下单测试
  - 支付流程测试（Stripe、PayPal、COD）
  - 订单管理测试
  - 多语言多货币测试
  
- [ ] Day 57-58: 性能优化
  - 图片懒加载
  - 代码分割（Code Splitting）
  - Redis缓存优化
  - 数据库查询优化（EXPLAIN ANALYZE）
  - Lighthouse性能测试（目标≥90分）
  
- [ ] Day 59-60: 安全审计
  - HTTPS配置
  - XSS/CSRF防护检查
  - SQL注入防护检查
  - 敏感数据加密检查
  - API限流测试
  
- [ ] Day 61-62: 生产环境部署
  - 阿里云ECS购买和配置
  - RDS PostgreSQL配置
  - Redis配置
  - Docker镜像构建
  - Docker Compose生产配置
  - 负载均衡配置（SLB）
  - 域名绑定（example.com）
  - SSL证书配置（Let's Encrypt）
  
- [ ] Day 63: 数据库迁移
  - 生产数据库初始化
  - 初始数据导入（分类、测试用户）
  
- [ ] Day 64: MVP上线 🎉
  - 最终测试
  - 监控告警配置（阿里云监控）
  - 数据库备份验证
  - 上线发布

---

## 八、开发规范与最佳实践

### 8.1 代码规范

**Java（Spring Boot）**:
- 遵循阿里巴巴Java开发手册
- 使用Lombok减少样板代码
- 使用MapStruct进行DTO转换
- 每个类必须有类注释
- 公共方法必须有方法注释

**TypeScript（Next.js）**:
- 遵循Airbnb JavaScript风格指南
- 使用ESLint和Prettier
- 组件必须有类型定义
- 使用函数式组件（Function Component）
- 自定义Hook以use开头

**Python（FastAPI）**:
- 遵循PEP 8
- 使用Type Hints
- 使用Pydantic进行数据验证
- 函数必须有Docstring

### 8.2 Git工作流

**分支策略**:
- `main`: 生产环境，只接受来自develop的合并
- `develop`: 开发主分支，所有feature合并到这里
- `feature/*`: 功能分支，如feature/product-management
- `hotfix/*`: 紧急修复分支

**Commit规范**:
```
<type>(<scope>): <subject>

<body>

<footer>

类型（type）：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式（不影响功能）
- refactor: 重构
- test: 测试
- chore: 构建/工具变动

示例：
feat(product): add AI content generation

- Integrate Wenxin Yiyan API
- Add async task queue
- Add quality check

Closes #123
```

### 8.3 测试策略

**单元测试**:
- Spring Boot: JUnit 5 + Mockito
- Next.js: Jest + React Testing Library
- FastAPI: pytest

**集成测试**:
- Spring Boot: @SpringBootTest
- 测试覆盖核心流程（注册、登录、下单）

**E2E测试**:
- Playwright（覆盖关键用户路径）

---

## 九、附录

### 9.1 环境变量配置

**.env（Spring Boot）**:
```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=ecommerce_user
DB_PASSWORD=password123

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-jwt-secret-key-min-256-bits
JWT_EXPIRATION=604800000

# Aliyun OSS
ALIYUN_OSS_ENDPOINT=oss-ap-southeast-1.aliyuncs.com
ALIYUN_OSS_BUCKET=ecommerce-assets
ALIYUN_OSS_ACCESS_KEY_ID=your-access-key
ALIYUN_OSS_ACCESS_KEY_SECRET=your-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# PayPal
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret
PAYPAL_MODE=sandbox

# FastAPI URL
FASTAPI_BASE_URL=http://localhost:8000
```

**.env.local（Next.js）**:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-client-id
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**.env（FastAPI）**:
```
REDIS_URL=redis://localhost:6379/0
WENXIN_API_KEY=your-wenxin-api-key
GLM_API_KEY=your-glm-api-key
AZURE_TRANSLATOR_KEY=your-azure-key
AZURE_REGION=southeastasia
```

---

**文档状态**: ✅ 已完成  
**最后更新**: 2025年11月16日  
**技术负责人**: 您（全栈工程师）

**下一步行动**:
1. 确认技术方案
2. 创建Git仓库
3. 初始化三个项目（Spring Boot、Next.js、FastAPI）
4. 搭建Docker开发环境
5. 开始Week 1-2的开发任务

祝开发顺利! 💪🚀
