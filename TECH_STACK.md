# TradeCraft 技术栈详解

本文档详细说明TradeCraft项目使用的所有技术栈、框架、库及其选型理由。

---

## 📚 目录

- [后端技术栈](#后端技术栈)
- [前端技术栈](#前端技术栈)
- [AI服务技术栈](#ai服务技术栈)
- [数据库与缓存](#数据库与缓存)
- [支付集成](#支付集成)
- [云服务与基础设施](#云服务与基础设施)
- [开发工具](#开发工具)
- [版本兼容性](#版本兼容性)

---

## 🔧 后端技术栈

### 核心框架

| 技术 | 版本 | 用途 | 选型理由 |
|------|------|------|----------|
| **Spring Boot** | 3.2.0 | 应用框架 | • 成熟稳定的企业级框架<br>• 丰富的生态系统<br>• 开箱即用的配置<br>• 强大的依赖注入 |
| **Java** | 17 (LTS) | 编程语言 | • 长期支持版本<br>• 性能优化<br>• Records、Pattern Matching等新特性<br>• 企业级应用首选 |
| **Maven** | 3.8+ | 构建工具 | • 标准化的项目结构<br>• 强大的依赖管理<br>• 丰富的插件生态 |

### Web层

```xml
<!-- Spring Web MVC -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

**特性**：
- RESTful API设计
- 请求参数验证（JSR-303）
- 异常统一处理
- CORS配置

### 数据访问层

```xml
<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- PostgreSQL Driver -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.6.0</version>
</dependency>

<!-- Hibernate Types for JSONB -->
<dependency>
    <groupId>com.vladmihalcea</groupId>
    <artifactId>hibernate-types-60</artifactId>
    <version>2.21.1</version>
</dependency>
```

**特性**：
- JPA Repository自动实现
- 自定义查询方法
- JSONB类型支持
- 事务管理

### 数据库迁移

```xml
<!-- Flyway -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>9.22.3</version>
</dependency>
```

**选型理由**：
- 版本控制数据库schema
- 可重复的迁移
- 团队协作友好
- 支持回滚

### 安全认证

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
</dependency>
```

**特性**：
- JWT无状态认证
- 基于角色的权限控制（RBAC）
- 密码加密（BCrypt）
- CSRF防护

### DTO映射

```xml
<!-- MapStruct -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
</dependency>
```

**选型理由**：
- 编译时代码生成，性能优秀
- 类型安全
- 减少手写映射代码
- 支持复杂映射场景

### 工具库

```xml
<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>

<!-- Apache Commons Lang -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.14.0</version>
</dependency>

<!-- Guava -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>32.1.3-jre</version>
</dependency>
```

### API文档

```xml
<!-- SpringDoc OpenAPI (Swagger) -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

**访问地址**：`http://localhost:8080/swagger-ui.html`

### 缓存

```xml
<!-- Spring Data Redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- Lettuce (Redis Client) -->
<dependency>
    <groupId>io.lettuce</groupId>
    <artifactId>lettuce-core</artifactId>
</dependency>
```

### 支付SDK

```xml
<!-- Stripe -->
<dependency>
    <groupId>com.stripe</groupId>
    <artifactId>stripe-java</artifactId>
    <version>24.3.0</version>
</dependency>

<!-- PayPal -->
<dependency>
    <groupId>com.paypal.sdk</groupId>
    <artifactId>checkout-sdk</artifactId>
    <version>2.0.0</version>
</dependency>
```

### 云服务SDK

```xml
<!-- 阿里云OSS -->
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.17.2</version>
</dependency>
```

### 测试

```xml
<!-- Spring Boot Test -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- JUnit 5 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

<!-- Mockito -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>

<!-- H2 Database (Test) -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

---

## 🎨 前端技术栈

### 核心框架

| 技术 | 版本 | 用途 | 选型理由 |
|------|------|------|----------|
| **Next.js** | 14.0.4 | React框架 | • App Router（最新架构）<br>• 服务端渲染（SSR）<br>• 静态生成（SSG）<br>• API Routes<br>• 图片优化<br>• SEO友好 |
| **React** | 18.2.0 | UI库 | • 组件化开发<br>• 虚拟DOM性能优秀<br>• 丰富的生态系统<br>• Hooks简化状态管理 |
| **TypeScript** | 5.3.3 | 编程语言 | • 静态类型检查<br>• IDE智能提示<br>• 重构友好<br>• 减少运行时错误 |

### 包管理

```json
{
  "packageManager": "npm@10.2.4"
}
```

**为什么选择npm**：
- 官方包管理器，稳定可靠
- 与Node.js深度集成
- lockfile（package-lock.json）确保依赖一致性

### UI框架

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

**Tailwind CSS特点**：
- 实用优先的CSS框架
- 高度可定制
- 按需生成，体积小
- 响应式设计简单

**Radix UI特点**：
- 无样式的可访问组件
- 键盘导航支持
- ARIA属性完整
- 与Tailwind完美配合

**Shadcn UI**：
```bash
npx shadcn-ui@latest init
```
- 可复制粘贴的组件
- 基于Radix UI + Tailwind CSS
- 完全可定制

### 状态管理

```json
{
  "dependencies": {
    "zustand": "^4.4.7"
  }
}
```

**选型理由**：
- 简单直观的API
- 无需Provider包裹
- TypeScript支持完善
- 体积小（~1KB）
- 支持中间件（persist、devtools）

**替代方案对比**：
| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **Zustand** | 简单、轻量 | 生态较小 | 中小型项目 ✅ |
| Redux | 生态丰富、DevTools强大 | 样板代码多、学习曲线陡 | 大型复杂项目 |
| Jotai | 原子化状态 | 概念较新 | 状态拆分细致的项目 |
| Context API | React内置 | 性能问题、重渲染 | 简单主题/国际化 |

### 表单管理

```json
{
  "dependencies": {
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4"
  }
}
```

**React Hook Form**：
- 高性能（减少重渲染）
- 简单的API
- 支持受控和非受控组件

**Zod**：
- TypeScript优先的schema验证
- 类型推断
- 与React Hook Form集成完美

### 数据请求

```json
{
  "dependencies": {
    "swr": "^2.2.4",
    "axios": "^1.6.2"
  }
}
```

**SWR（Stale-While-Revalidate）**：
- 自动缓存
- 自动重新验证
- 自动错误重试
- 焦点重新验证
- 网络恢复重新验证

**Axios**：
- 请求/响应拦截器
- 自动JSON转换
- 取消请求
- 超时设置

### 国际化

```json
{
  "dependencies": {
    "next-intl": "^3.4.0"
  }
}
```

**特性**：
- 基于Next.js App Router
- 类型安全的翻译
- 支持命名空间
- 自动路由本地化

### 图标库

```json
{
  "dependencies": {
    "lucide-react": "^0.294.0"
  }
}
```

**选型理由**：
- React组件形式
- Tree-shakeable（按需引入）
- 1000+图标
- 设计现代

### 支付集成

```json
{
  "dependencies": {
    "@stripe/stripe-js": "^2.2.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "@paypal/react-paypal-js": "^8.1.3"
  }
}
```

### 日期处理

```json
{
  "dependencies": {
    "date-fns": "^2.30.0"
  }
}
```

**为什么选date-fns而不是moment.js**：
- 模块化，按需引入
- Tree-shakeable
- 不可变（函数式）
- TypeScript支持好
- 体积小得多

### 图表库

```json
{
  "dependencies": {
    "recharts": "^2.10.3"
  }
}
```

**用途**：管理仪表盘的销售图表

### 开发工具

```json
{
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/node": "^20.10.5",
    "eslint": "^8.55.0",
    "eslint-config-next": "14.0.4",
    "prettier": "^3.1.1",
    "prettier-plugin-tailwindcss": "^0.5.9",
    "@playwright/test": "^1.40.1",
    "typescript": "^5.3.3"
  }
}
```

---

## 🤖 AI服务技术栈

### 核心框架

| 技术 | 版本 | 用途 | 选型理由 |
|------|------|------|----------|
| **FastAPI** | 0.109.0 | Web框架 | • 性能优秀（基于Starlette）<br>• 自动API文档<br>• 类型提示支持<br>• 异步支持<br>• 简单易用 |
| **Python** | 3.11+ | 编程语言 | • AI/ML生态丰富<br>• 简洁的语法<br>• 异步编程支持<br>• 类型提示改进 |
| **Uvicorn** | 0.25.0 | ASGI服务器 | • 高性能<br>• 支持异步<br>• 热重载 |

### AI SDK

```txt
# requirements.txt

# 文心一言（百度）
qianfan==0.3.5

# GLM-4（智谱AI）
zhipuai==2.0.1

# Azure翻译
azure-ai-translation-text==1.0.0

# OpenAI（备用）
openai==1.6.1
```

### HTTP客户端

```txt
httpx==0.26.0        # 异步HTTP客户端
aiohttp==3.9.1       # 异步HTTP客户端（备用）
```

### 数据验证

```txt
pydantic==2.5.3      # 数据验证（FastAPI内置）
pydantic-settings==2.1.0
```

### 异步任务

```txt
celery==5.3.4        # 分布式任务队列
redis==5.0.1         # Celery broker
```

### 工具库

```txt
python-dotenv==1.0.0  # 环境变量
loguru==0.7.2         # 日志
tenacity==8.2.3       # 重试机制
```

### 测试

```txt
pytest==7.4.3
pytest-asyncio==0.23.2
pytest-cov==4.1.0
httpx==0.26.0         # 测试HTTP请求
```

---

## 💾 数据库与缓存

### PostgreSQL

| 特性 | 说明 |
|------|------|
| **版本** | 15 (Alpine) |
| **选型理由** | • 开源、功能强大<br>• JSONB类型支持<br>• 全文搜索<br>• 事务ACID保证<br>• 丰富的扩展 |
| **Docker镜像** | `postgres:15-alpine` |

**关键配置**：
```yaml
# docker-compose.yml
environment:
  POSTGRES_DB: tradecraft_dev
  POSTGRES_USER: tradecraft
  POSTGRES_PASSWORD: ${DB_PASSWORD}
volumes:
  - postgres_data:/var/lib/postgresql/data
```

### Redis

| 特性 | 说明 |
|------|------|
| **版本** | 7.2 (Alpine) |
| **用途** | • Session存储<br>• 缓存热点数据<br>• Celery消息队列 |
| **Docker镜像** | `redis:7-alpine` |

**使用场景**：
```java
// 商品缓存
@Cacheable(value = "products", key = "#id")
public Product getProductById(Long id) { ... }

// 分类树缓存
@Cacheable(value = "categories", key = "'tree'")
public List<CategoryTreeNode> getCategoryTree() { ... }

// 购物车缓存
@Cacheable(value = "cart", key = "#userId")
public Cart getCart(Long userId) { ... }
```

---

## 💳 支付集成

### Stripe

| 项目 | 说明 |
|------|------|
| **版本** | Java SDK 24.3.0<br>JS SDK 2.2.0 |
| **支持支付方式** | 信用卡、借记卡、Apple Pay、Google Pay |
| **特点** | • 开发友好<br>• 文档完善<br>• 支持订阅<br>• Webhook可靠 |
| **费用** | 2.9% + $0.30/笔 |

### PayPal

| 项目 | 说明 |
|------|------|
| **版本** | Checkout SDK 2.0.0<br>React SDK 8.1.3 |
| **支持支付方式** | PayPal余额、信用卡 |
| **特点** | • 全球用户基数大<br>• 买家保护<br>• 支持多币种 |
| **费用** | 4.4% + 固定费用 |

### Cash on Delivery (COD)

纯后端实现，无需第三方SDK。

---

## ☁️ 云服务与基础设施

### 阿里云OSS

| 项目 | 说明 |
|------|------|
| **用途** | 图片、文件存储 |
| **SDK** | aliyun-sdk-oss 3.17.2 |
| **特点** | • CDN加速<br>• 图片处理<br>• 防盗链<br>• 低成本 |
| **区域** | 杭州（oss-cn-hangzhou） |

### Google Analytics 4

| 项目 | 说明 |
|------|------|
| **用途** | 用户行为分析、转化跟踪 |
| **集成方式** | gtag.js |
| **追踪事件** | • 页面浏览<br>• 商品查看<br>• 添加购物车<br>• 购买转化 |

### Docker & Docker Compose

| 项目 | 说明 |
|------|------|
| **Docker** | >= 20.10 |
| **Docker Compose** | >= 2.0 |
| **用途** | 开发环境、生产部署 |

**容器列表**：
- `tradecraft-backend` - Spring Boot
- `tradecraft-frontend` - Next.js
- `tradecraft-ai` - FastAPI
- `tradecraft-db` - PostgreSQL
- `tradecraft-redis` - Redis
- `tradecraft-nginx` - Nginx

### Nginx

| 项目 | 说明 |
|------|------|
| **版本** | Alpine latest |
| **用途** | • 反向代理<br>• 负载均衡<br>• SSL终止<br>• 静态资源服务 |

---

## 🛠️ 开发工具

### 版本控制

- **Git** >= 2.30
- **GitHub** - 代码托管
- **Git Flow** - 分支管理策略

### IDE

| IDE | 适用 | 推荐插件 |
|-----|------|----------|
| **IntelliJ IDEA Ultimate** | 后端 | Lombok, Spring Boot, Database Tools |
| **VS Code** | 前端、Python | ESLint, Prettier, Tailwind CSS IntelliSense |
| **PyCharm Professional** | AI服务 | Python, FastAPI |

### API测试

- **Postman** - API测试
- **Insomnia** - REST客户端
- **Swagger UI** - 自动生成的API文档

### 数据库工具

- **DBeaver** - 免费、跨平台
- **DataGrip** - JetBrains付费工具
- **pgAdmin** - PostgreSQL官方工具

---

## 📊 版本兼容性矩阵

### Java生态

| 组件 | Java 17 | Java 21 |
|------|---------|---------|
| Spring Boot 3.2.0 | ✅ | ✅ |
| PostgreSQL Driver 42.6.0 | ✅ | ✅ |
| Flyway 9.22.3 | ✅ | ✅ |

### Node.js生态

| 组件 | Node 18 | Node 20 |
|------|---------|---------|
| Next.js 14.0.4 | ✅ | ✅ |
| React 18.2.0 | ✅ | ✅ |

### Python生态

| 组件 | Python 3.11 | Python 3.12 |
|------|-------------|-------------|
| FastAPI 0.109.0 | ✅ | ✅ |
| Pydantic 2.5.3 | ✅ | ✅ |

---

## 🔄 依赖更新策略

### 定期更新

- **安全补丁**：立即更新
- **次要版本**：每月检查
- **主要版本**：评估后谨慎更新

### 检查工具

**后端**：
```bash
./mvnw versions:display-dependency-updates
```

**前端**：
```bash
npm outdated
npx npm-check-updates
```

**Python**：
```bash
pip list --outdated
```

---

## 📈 性能基准

### 后端

- **启动时间**：~8秒
- **API响应时间**（p95）：< 300ms
- **内存占用**：~512MB（JVM）
- **并发支持**：150+ req/s（单实例）

### 前端

- **首次内容绘制（FCP）**：< 1.5s
- **最大内容绘制（LCP）**：< 2.5s
- **首次输入延迟（FID）**：< 100ms
- **累积布局偏移（CLS）**：< 0.1

### AI服务

- **启动时间**：~2秒
- **内容生成时间**：5-10秒
- **内存占用**：~256MB
- **并发支持**：20+ req/s

---

## 🎯 技术选型总结

### 为什么选择这套技术栈？

**1. 成熟稳定**
- Spring Boot、Next.js、PostgreSQL都是业界验证的技术
- 文档丰富，社区活跃
- 长期支持

**2. 开发效率**
- Spring Boot自动配置减少样板代码
- Next.js App Router简化路由
- TypeScript提高代码质量
- Tailwind CSS加速UI开发

**3. 性能优秀**
- Next.js SSR/SSG优化首屏加载
- Redis缓存提升响应速度
- PostgreSQL查询优化
- FastAPI异步处理AI请求

**4. 可扩展性**
- 模块化单体架构，便于后续微服务拆分
- Docker容器化，易于水平扩展
- 缓存层设计完善

**5. 成本控制**
- 全部使用开源技术（除支付网关）
- 阿里云OSS成本低
- Docker部署灵活

---

**最后更新**: 2025年11月16日
**维护者**: Claude Code
