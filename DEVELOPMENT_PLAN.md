# 跨境电商AI自动化平台 - 详细开发计划

**版本**: v1.0
**创建日期**: 2025年11月16日
**开发周期**: 12周（3个月）
**开发模式**: 1人全栈开发

---

## 📋 目录

- [一、项目初始化（Week 1，Day 1-2）](#一项目初始化week-1day-1-2)
- [二、数据库设计与基础架构（Week 1-2，Day 3-10）](#二数据库设计与基础架构week-1-2day-3-10)
- [三、商品管理模块（Week 3-4，Day 11-20）](#三商品管理模块week-3-4day-11-20)
- [四、独立站前台基础（Week 5-6，Day 21-30）](#四独立站前台基础week-5-6day-21-30)
- [五、用户与订单模块（Week 7-8，Day 31-40）](#五用户与订单模块week-7-8day-31-40)
- [六、支付与物流集成（Week 9-10，Day 41-50）](#六支付与物流集成week-9-10day-41-50)
- [七、数据分析与上线（Week 11-12，Day 51-64）](#七数据分析与上线week-11-12day-51-64)

---

## 一、项目初始化（Week 1，Day 1-2）

### Day 1: Git仓库与项目结构

#### 1.1 创建Git仓库结构

```bash
# 项目根目录结构
TradeCraft/
├── .github/
│   └── workflows/
│       ├── backend-ci.yml          # Spring Boot CI
│       ├── frontend-ci.yml         # Next.js CI
│       └── ai-service-ci.yml       # FastAPI CI
├── backend/                        # Spring Boot 后端
├── frontend/                       # Next.js 前端
├── ai-service/                     # FastAPI AI服务
├── docker-compose.yml              # 开发环境
├── docker-compose.prod.yml         # 生产环境
├── README.md
├── prd.md
├── tdd.md
└── DEVELOPMENT_PLAN.md
```

#### 1.2 Git分支策略

```bash
# 创建分支
git checkout -b develop
git checkout -b feature/project-init

# 分支规则
main           # 生产环境，只接受来自develop的PR
develop        # 开发主分支
feature/*      # 功能分支
hotfix/*       # 紧急修复
```

#### 1.3 提交规范配置

**安装commitlint**:
```bash
npm install -g @commitlint/cli @commitlint/config-conventional
npm install -g husky

# 配置 .commitlintrc.json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [2, "always", [
      "feat", "fix", "docs", "style", "refactor",
      "test", "chore", "revert"
    ]]
  }
}
```

---

### Day 2: Spring Boot项目初始化

#### 2.1 创建Spring Boot项目

```bash
cd backend
spring init \
  --dependencies=web,data-jpa,postgresql,data-redis,security,validation,lombok \
  --group-id=com.tradecraft \
  --artifact-id=ecommerce-api \
  --name=TradeCraft-API \
  --java-version=17 \
  --build=maven \
  ecommerce-api
```

#### 2.2 后端项目结构（详细）

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/tradecraft/ecommerce/
│   │   │   ├── EcommerceApplication.java           # 启动类
│   │   │   │
│   │   │   ├── config/                             # 配置类包
│   │   │   │   ├── SecurityConfig.java             # Spring Security配置
│   │   │   │   ├── JwtConfig.java                  # JWT配置
│   │   │   │   ├── RedisConfig.java                # Redis配置
│   │   │   │   ├── CorsConfig.java                 # CORS配置
│   │   │   │   ├── SwaggerConfig.java              # Swagger/OpenAPI配置
│   │   │   │   ├── OssConfig.java                  # 阿里云OSS配置
│   │   │   │   ├── AsyncConfig.java                # 异步任务配置
│   │   │   │   └── MeilisearchConfig.java          # Meilisearch配置
│   │   │   │
│   │   │   ├── controller/                         # 控制器包
│   │   │   │   ├── admin/                          # 管理后台API
│   │   │   │   │   ├── AdminProductController.java
│   │   │   │   │   ├── AdminOrderController.java
│   │   │   │   │   ├── AdminAnalyticsController.java
│   │   │   │   │   └── AdminCategoryController.java
│   │   │   │   │
│   │   │   │   ├── storefront/                     # 前台API
│   │   │   │   │   ├── ProductController.java
│   │   │   │   │   ├── CategoryController.java
│   │   │   │   │   ├── CartController.java
│   │   │   │   │   ├── CheckoutController.java
│   │   │   │   │   └── OrderController.java
│   │   │   │   │
│   │   │   │   ├── auth/                           # 认证API
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   └── UserController.java
│   │   │   │   │
│   │   │   │   └── webhook/                        # Webhook API
│   │   │   │       ├── StripeWebhookController.java
│   │   │   │       └── PayPalWebhookController.java
│   │   │   │
│   │   │   ├── service/                            # 业务逻辑层
│   │   │   │   ├── product/                        # 商品服务
│   │   │   │   │   ├── ProductService.java
│   │   │   │   │   ├── ProductServiceImpl.java
│   │   │   │   │   ├── ProductSkuService.java
│   │   │   │   │   ├── ProductSkuServiceImpl.java
│   │   │   │   │   ├── CategoryService.java
│   │   │   │   │   └── CategoryServiceImpl.java
│   │   │   │   │
│   │   │   │   ├── order/                          # 订单服务
│   │   │   │   │   ├── OrderService.java
│   │   │   │   │   ├── OrderServiceImpl.java
│   │   │   │   │   ├── OrderItemService.java
│   │   │   │   │   └── OrderStatusService.java
│   │   │   │   │
│   │   │   │   ├── user/                           # 用户服务
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   ├── UserServiceImpl.java
│   │   │   │   │   ├── AddressService.java
│   │   │   │   │   └── UserProfileService.java
│   │   │   │   │
│   │   │   │   ├── cart/                           # 购物车服务
│   │   │   │   │   ├── CartService.java
│   │   │   │   │   └── CartServiceImpl.java
│   │   │   │   │
│   │   │   │   ├── payment/                        # 支付服务
│   │   │   │   │   ├── PaymentService.java
│   │   │   │   │   ├── StripePaymentService.java
│   │   │   │   │   ├── PayPalPaymentService.java
│   │   │   │   │   └── CodPaymentService.java
│   │   │   │   │
│   │   │   │   ├── ai/                             # AI服务
│   │   │   │   │   ├── AIContentService.java
│   │   │   │   │   ├── AIContentServiceImpl.java
│   │   │   │   │   └── AITaskService.java
│   │   │   │   │
│   │   │   │   ├── search/                         # 搜索服务
│   │   │   │   │   ├── SearchService.java
│   │   │   │   │   └── SearchServiceImpl.java
│   │   │   │   │
│   │   │   │   ├── storage/                        # 存储服务
│   │   │   │   │   ├── OssService.java
│   │   │   │   │   └── OssServiceImpl.java
│   │   │   │   │
│   │   │   │   └── analytics/                      # 数据分析服务
│   │   │   │       ├── AnalyticsService.java
│   │   │   │       └── AnalyticsServiceImpl.java
│   │   │   │
│   │   │   ├── repository/                         # 数据访问层
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── UserProfileRepository.java
│   │   │   │   ├── AddressRepository.java
│   │   │   │   ├── ProductRepository.java
│   │   │   │   ├── ProductSkuRepository.java
│   │   │   │   ├── CategoryRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   ├── OrderItemRepository.java
│   │   │   │   ├── OrderStatusHistoryRepository.java
│   │   │   │   └── CartItemRepository.java
│   │   │   │
│   │   │   ├── entity/                             # 实体类
│   │   │   │   ├── User.java
│   │   │   │   ├── UserProfile.java
│   │   │   │   ├── Address.java
│   │   │   │   ├── Product.java
│   │   │   │   ├── ProductSku.java
│   │   │   │   ├── Category.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── OrderItem.java
│   │   │   │   ├── OrderStatusHistory.java
│   │   │   │   └── CartItem.java
│   │   │   │
│   │   │   ├── dto/                                # 数据传输对象
│   │   │   │   ├── request/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   │   └── ChangePasswordRequest.java
│   │   │   │   │   │
│   │   │   │   │   ├── product/
│   │   │   │   │   │   ├── CreateProductRequest.java
│   │   │   │   │   │   ├── UpdateProductRequest.java
│   │   │   │   │   │   ├── GenerateAIContentRequest.java
│   │   │   │   │   │   └── ProductSearchRequest.java
│   │   │   │   │   │
│   │   │   │   │   ├── order/
│   │   │   │   │   │   ├── CreateOrderRequest.java
│   │   │   │   │   │   ├── ShipOrderRequest.java
│   │   │   │   │   │   └── CancelOrderRequest.java
│   │   │   │   │   │
│   │   │   │   │   └── cart/
│   │   │   │   │       ├── AddToCartRequest.java
│   │   │   │   │       └── UpdateCartItemRequest.java
│   │   │   │   │
│   │   │   │   └── response/
│   │   │   │       ├── ApiResponse.java            # 统一响应包装
│   │   │   │       ├── PageResponse.java           # 分页响应
│   │   │   │       ├── auth/
│   │   │   │       │   ├── AuthResponse.java
│   │   │   │       │   └── UserResponse.java
│   │   │   │       │
│   │   │   │       ├── product/
│   │   │   │       │   ├── ProductResponse.java
│   │   │   │       │   ├── ProductListResponse.java
│   │   │   │       │   └── AIContentResponse.java
│   │   │   │       │
│   │   │   │       └── order/
│   │   │   │           ├── OrderResponse.java
│   │   │   │           └── OrderListResponse.java
│   │   │   │
│   │   │   ├── exception/                          # 异常处理
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── BusinessException.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── UnauthorizedException.java
│   │   │   │   └── ValidationException.java
│   │   │   │
│   │   │   ├── security/                           # 安全相关
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── UserDetailsServiceImpl.java
│   │   │   │   └── SecurityUtils.java
│   │   │   │
│   │   │   ├── util/                               # 工具类
│   │   │   │   ├── DateUtil.java
│   │   │   │   ├── StringUtil.java
│   │   │   │   ├── JsonUtil.java
│   │   │   │   ├── CurrencyUtil.java
│   │   │   │   ├── FileUtil.java
│   │   │   │   └── ValidationUtil.java
│   │   │   │
│   │   │   ├── enums/                              # 枚举类
│   │   │   │   ├── UserRole.java
│   │   │   │   ├── UserStatus.java
│   │   │   │   ├── ProductStatus.java
│   │   │   │   ├── OrderStatus.java
│   │   │   │   ├── PaymentMethod.java
│   │   │   │   ├── PaymentStatus.java
│   │   │   │   ├── ShippingMethod.java
│   │   │   │   ├── Currency.java
│   │   │   │   └── Language.java
│   │   │   │
│   │   │   ├── constant/                           # 常量类
│   │   │   │   ├── ApiConstants.java
│   │   │   │   ├── RedisKeyConstants.java
│   │   │   │   ├── JwtConstants.java
│   │   │   │   └── BusinessConstants.java
│   │   │   │
│   │   │   └── mapper/                             # MapStruct映射器
│   │   │       ├── UserMapper.java
│   │   │       ├── ProductMapper.java
│   │   │       ├── OrderMapper.java
│   │   │       └── CartMapper.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml                     # 主配置文件
│   │       ├── application-dev.yml                 # 开发环境配置
│   │       ├── application-prod.yml                # 生产环境配置
│   │       ├── db/
│   │       │   └── migration/                      # Flyway迁移脚本
│   │       │       ├── V1__Create_users_table.sql
│   │       │       ├── V2__Create_products_table.sql
│   │       │       ├── V3__Create_orders_table.sql
│   │       │       └── V4__Insert_initial_data.sql
│   │       └── static/
│   │
│   └── test/                                       # 测试代码
│       └── java/com/tradecraft/ecommerce/
│           ├── service/
│           │   ├── ProductServiceTest.java
│           │   ├── OrderServiceTest.java
│           │   └── UserServiceTest.java
│           └── controller/
│               └── ProductControllerTest.java
│
├── pom.xml                                         # Maven依赖
├── Dockerfile                                      # Docker镜像
└── README.md
```

#### 2.3 pom.xml 依赖配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <groupId>com.tradecraft</groupId>
    <artifactId>ecommerce-api</artifactId>
    <version>1.0.0</version>
    <name>TradeCraft API</name>

    <properties>
        <java.version>17</java.version>
        <mapstruct.version>1.5.5.Final</mapstruct.version>
        <lombok.version>1.18.30</lombok.version>
        <jjwt.version>0.11.5</jjwt.version>
        <aliyun-oss.version>3.17.1</aliyun-oss.version>
        <stripe.version>23.0.0</stripe.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
        </dependency>

        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
        </dependency>

        <!-- MapStruct -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-processor</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>

        <!-- Swagger/OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.2.0</version>
        </dependency>

        <!-- Aliyun OSS -->
        <dependency>
            <groupId>com.aliyun.oss</groupId>
            <artifactId>aliyun-sdk-oss</artifactId>
            <version>${aliyun-oss.version}</version>
        </dependency>

        <!-- Stripe -->
        <dependency>
            <groupId>com.stripe</groupId>
            <artifactId>stripe-java</artifactId>
            <version>${stripe.version}</version>
        </dependency>

        <!-- PayPal -->
        <dependency>
            <groupId>com.paypal.sdk</groupId>
            <artifactId>rest-api-sdk</artifactId>
            <version>1.14.0</version>
        </dependency>

        <!-- Meilisearch -->
        <dependency>
            <groupId>com.meilisearch.sdk</groupId>
            <artifactId>meilisearch-java</artifactId>
            <version>0.11.0</version>
        </dependency>

        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

#### 2.4 Next.js项目初始化

```bash
cd frontend
npx create-next-app@14 . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

#### 2.5 前端项目结构（详细）

```
frontend/
├── src/
│   ├── app/                                        # Next.js App Router
│   │   ├── [locale]/                               # 多语言路由
│   │   │   ├── layout.tsx                          # 根布局
│   │   │   ├── page.tsx                            # 首页
│   │   │   ├── loading.tsx                         # 全局Loading
│   │   │   ├── error.tsx                           # 错误页面
│   │   │   ├── not-found.tsx                       # 404页面
│   │   │   │
│   │   │   ├── products/                           # 商品页面
│   │   │   │   ├── page.tsx                        # 商品列表页
│   │   │   │   ├── loading.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx                    # 商品详情页
│   │   │   │       └── loading.tsx
│   │   │   │
│   │   │   ├── categories/                         # 分类页面
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── cart/                               # 购物车
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── checkout/                           # 结账
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── order/                              # 订单
│   │   │   │   ├── confirmation/
│   │   │   │   │   └── page.tsx                    # 订单确认页
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx                    # 订单详情页
│   │   │   │
│   │   │   ├── account/                            # 个人中心
│   │   │   │   ├── layout.tsx                      # 个人中心布局
│   │   │   │   ├── page.tsx                        # 个人信息
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx                    # 订单列表
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx                # 订单详情
│   │   │   │   ├── addresses/
│   │   │   │   │   └── page.tsx                    # 收货地址管理
│   │   │   │   └── password/
│   │   │   │       └── page.tsx                    # 修改密码
│   │   │   │
│   │   │   ├── auth/                               # 认证
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx                    # 登录页
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx                    # 注册页
│   │   │   │   └── forgot-password/
│   │   │   │       └── page.tsx                    # 忘记密码
│   │   │   │
│   │   │   └── about/                              # 关于我们
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/                                  # 管理后台
│   │   │   ├── layout.tsx                          # 后台布局
│   │   │   ├── page.tsx                            # Dashboard
│   │   │   │
│   │   │   ├── products/                           # 商品管理
│   │   │   │   ├── page.tsx                        # 商品列表
│   │   │   │   ├── add/
│   │   │   │   │   └── page.tsx                    # 添加商品
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx                    # 商品详情
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx                # 编辑商品
│   │   │   │
│   │   │   ├── categories/                         # 分类管理
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── orders/                             # 订单管理
│   │   │   │   ├── page.tsx                        # 订单列表
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx                    # 订单详情
│   │   │   │
│   │   │   └── analytics/                          # 数据分析
│   │   │       └── page.tsx                        # 报表Dashboard
│   │   │
│   │   └── api/                                    # Next.js API Routes
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts                    # NextAuth配置
│   │       │
│   │       └── webhook/
│   │           └── stripe/
│   │               └── route.ts                    # Stripe Webhook
│   │
│   ├── components/                                 # React组件
│   │   ├── ui/                                     # Shadcn UI组件
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                                 # 布局组件
│   │   │   ├── Header.tsx                          # 网站头部
│   │   │   ├── Footer.tsx                          # 网站底部
│   │   │   ├── Navbar.tsx                          # 导航栏
│   │   │   ├── Sidebar.tsx                         # 侧边栏（管理后台）
│   │   │   ├── MobileNav.tsx                       # 移动端导航
│   │   │   ├── Breadcrumb.tsx                      # 面包屑导航
│   │   │   └── Container.tsx                       # 容器组件
│   │   │
│   │   ├── common/                                 # 通用组件
│   │   │   ├── Loading.tsx                         # 加载动画
│   │   │   ├── LoadingSpinner.tsx                  # 旋转加载
│   │   │   ├── ErrorBoundary.tsx                   # 错误边界
│   │   │   ├── Pagination.tsx                      # 分页组件
│   │   │   ├── SearchBar.tsx                       # 搜索栏
│   │   │   ├── LanguageSwitcher.tsx                # 语言切换
│   │   │   ├── CurrencySwitcher.tsx                # 货币切换
│   │   │   ├── ThemeToggle.tsx                     # 主题切换
│   │   │   └── BackToTop.tsx                       # 回到顶部
│   │   │
│   │   ├── product/                                # 商品相关组件
│   │   │   ├── ProductCard.tsx                     # 商品卡片
│   │   │   ├── ProductGrid.tsx                     # 商品网格
│   │   │   ├── ProductList.tsx                     # 商品列表
│   │   │   ├── ProductFilter.tsx                   # 商品筛选
│   │   │   ├── ProductSort.tsx                     # 商品排序
│   │   │   ├── ProductGallery.tsx                  # 商品图片画廊
│   │   │   ├── ProductImageZoom.tsx                # 图片放大查看
│   │   │   ├── VariantSelector.tsx                 # 规格选择器
│   │   │   ├── QuantitySelector.tsx                # 数量选择器
│   │   │   ├── PriceDisplay.tsx                    # 价格显示
│   │   │   ├── StockStatus.tsx                     # 库存状态
│   │   │   ├── RelatedProducts.tsx                 # 相关推荐
│   │   │   ├── ProductReviews.tsx                  # 商品评价（P1）
│   │   │   │
│   │   │   └── admin/                              # 管理后台商品组件
│   │   │       ├── ProductForm.tsx                 # 商品表单
│   │   │       ├── ProductFormBasicInfo.tsx        # 基本信息步骤
│   │   │       ├── ProductFormPricing.tsx          # 定价步骤
│   │   │       ├── ProductFormImages.tsx           # 图片上传步骤
│   │   │       ├── ProductFormSEO.tsx              # SEO设置
│   │   │       ├── ProductSkuTable.tsx             # SKU表格
│   │   │       ├── ProductSkuModal.tsx             # SKU编辑弹窗
│   │   │       ├── ImageUploader.tsx               # 图片上传组件
│   │   │       ├── ImageCropper.tsx                # 图片裁剪
│   │   │       ├── AIContentGenerator.tsx          # AI内容生成
│   │   │       ├── AIContentPreview.tsx            # AI内容预览
│   │   │       └── AIContentEditor.tsx             # AI内容编辑
│   │   │
│   │   ├── cart/                                   # 购物车组件
│   │   │   ├── CartDrawer.tsx                      # 购物车抽屉
│   │   │   ├── CartIcon.tsx                        # 购物车图标（带徽章）
│   │   │   ├── CartItem.tsx                        # 购物车商品项
│   │   │   ├── CartSummary.tsx                     # 购物车汇总
│   │   │   └── EmptyCart.tsx                       # 空购物车状态
│   │   │
│   │   ├── checkout/                               # 结账组件
│   │   │   ├── CheckoutSteps.tsx                   # 结账步骤指示器
│   │   │   ├── ShippingForm.tsx                    # 收货地址表单
│   │   │   ├── ShippingMethodSelector.tsx          # 配送方式选择
│   │   │   ├── PaymentMethodSelector.tsx           # 支付方式选择
│   │   │   ├── StripePaymentForm.tsx               # Stripe支付表单
│   │   │   ├── PayPalButton.tsx                    # PayPal按钮
│   │   │   ├── OrderSummary.tsx                    # 订单摘要
│   │   │   └── CouponInput.tsx                     # 优惠券输入（P1）
│   │   │
│   │   ├── order/                                  # 订单组件
│   │   │   ├── OrderCard.tsx                       # 订单卡片
│   │   │   ├── OrderList.tsx                       # 订单列表
│   │   │   ├── OrderStatusBadge.tsx                # 订单状态徽章
│   │   │   ├── OrderTimeline.tsx                   # 订单时间线
│   │   │   ├── OrderTrackingInfo.tsx               # 物流追踪信息
│   │   │   │
│   │   │   └── admin/                              # 管理后台订单组件
│   │   │       ├── OrderTable.tsx                  # 订单表格
│   │   │       ├── OrderDetailModal.tsx            # 订单详情弹窗
│   │   │       ├── ShippingModal.tsx               # 发货弹窗
│   │   │       └── RefundModal.tsx                 # 退款弹窗
│   │   │
│   │   ├── user/                                   # 用户组件
│   │   │   ├── LoginForm.tsx                       # 登录表单
│   │   │   ├── RegisterForm.tsx                    # 注册表单
│   │   │   ├── ProfileForm.tsx                     # 个人信息表单
│   │   │   ├── AddressForm.tsx                     # 地址表单
│   │   │   ├── AddressList.tsx                     # 地址列表
│   │   │   ├── AddressCard.tsx                     # 地址卡片
│   │   │   ├── ChangePasswordForm.tsx              # 修改密码表单
│   │   │   └── UserAvatar.tsx                      # 用户头像
│   │   │
│   │   ├── category/                               # 分类组件
│   │   │   ├── CategoryNav.tsx                     # 分类导航
│   │   │   ├── CategoryTree.tsx                    # 分类树
│   │   │   ├── CategoryCard.tsx                    # 分类卡片
│   │   │   └── CategoryBreadcrumb.tsx              # 分类面包屑
│   │   │
│   │   ├── analytics/                              # 数据分析组件（管理后台）
│   │   │   ├── DashboardStats.tsx                  # Dashboard统计卡片
│   │   │   ├── SalesChart.tsx                      # 销售趋势图
│   │   │   ├── OrderStatusChart.tsx                # 订单状态分布图
│   │   │   ├── PaymentMethodChart.tsx              # 支付方式分布图
│   │   │   ├── TopProductsTable.tsx                # 畅销商品表格
│   │   │   └── DateRangePicker.tsx                 # 日期范围选择器
│   │   │
│   │   └── home/                                   # 首页组件
│   │       ├── HeroBanner.tsx                      # 轮播Banner
│   │       ├── FeaturedProducts.tsx                # 热销商品
│   │       ├── CategoryShowcase.tsx                # 分类展示
│   │       ├── PromotionSection.tsx                # 促销区域（P1）
│   │       └── NewsletterSubscribe.tsx             # 邮件订阅（P1）
│   │
│   ├── lib/                                        # 工具库
│   │   ├── api/                                    # API客户端
│   │   │   ├── client.ts                           # Axios配置
│   │   │   ├── auth.api.ts                         # 认证API
│   │   │   ├── product.api.ts                      # 商品API
│   │   │   ├── category.api.ts                     # 分类API
│   │   │   ├── cart.api.ts                         # 购物车API
│   │   │   ├── order.api.ts                        # 订单API
│   │   │   ├── user.api.ts                         # 用户API
│   │   │   ├── payment.api.ts                      # 支付API
│   │   │   └── analytics.api.ts                    # 数据分析API
│   │   │
│   │   ├── auth/                                   # 认证工具
│   │   │   ├── session.ts                          # Session管理
│   │   │   ├── token.ts                            # Token处理
│   │   │   └── permissions.ts                      # 权限检查
│   │   │
│   │   ├── currency/                               # 货币工具
│   │   │   ├── converter.ts                        # 货币转换
│   │   │   ├── formatter.ts                        # 货币格式化
│   │   │   └── exchange-rate.ts                    # 汇率获取
│   │   │
│   │   ├── validation/                             # 表单验证
│   │   │   ├── schemas.ts                          # Zod验证模式
│   │   │   ├── product.schema.ts                   # 商品验证
│   │   │   ├── order.schema.ts                     # 订单验证
│   │   │   └── user.schema.ts                      # 用户验证
│   │   │
│   │   ├── utils/                                  # 工具函数
│   │   │   ├── date.ts                             # 日期工具
│   │   │   ├── string.ts                           # 字符串工具
│   │   │   ├── number.ts                           # 数字工具
│   │   │   ├── file.ts                             # 文件工具
│   │   │   ├── url.ts                              # URL工具
│   │   │   └── analytics.ts                        # GA4事件追踪
│   │   │
│   │   └── constants/                              # 常量
│   │       ├── routes.ts                           # 路由常量
│   │       ├── api-endpoints.ts                    # API端点
│   │       ├── currencies.ts                       # 货币配置
│   │       ├── languages.ts                        # 语言配置
│   │       └── common.ts                           # 通用常量
│   │
│   ├── store/                                      # Zustand状态管理
│   │   ├── useCartStore.ts                         # 购物车状态
│   │   ├── useUserStore.ts                         # 用户状态
│   │   ├── useSettingsStore.ts                     # 设置状态（语言、货币）
│   │   ├── useProductStore.ts                      # 商品状态（管理后台）
│   │   └── useOrderStore.ts                        # 订单状态（管理后台）
│   │
│   ├── types/                                      # TypeScript类型定义
│   │   ├── api.ts                                  # API响应类型
│   │   ├── product.ts                              # 商品类型
│   │   ├── category.ts                             # 分类类型
│   │   ├── order.ts                                # 订单类型
│   │   ├── user.ts                                 # 用户类型
│   │   ├── cart.ts                                 # 购物车类型
│   │   ├── payment.ts                              # 支付类型
│   │   └── common.ts                               # 通用类型
│   │
│   ├── hooks/                                      # 自定义Hooks
│   │   ├── useAuth.ts                              # 认证Hook
│   │   ├── useCart.ts                              # 购物车Hook
│   │   ├── useProducts.ts                          # 商品Hook
│   │   ├── useOrders.ts                            # 订单Hook
│   │   ├── useCurrency.ts                          # 货币Hook
│   │   ├── useLanguage.ts                          # 语言Hook
│   │   ├── useDebounce.ts                          # 防抖Hook
│   │   ├── useMediaQuery.ts                        # 媒体查询Hook
│   │   ├── useLocalStorage.ts                      # LocalStorage Hook
│   │   └── useInfiniteScroll.ts                    # 无限滚动Hook
│   │
│   └── styles/
│       ├── globals.css                             # 全局样式
│       └── variables.css                           # CSS变量
│
├── public/                                         # 静态文件
│   ├── images/
│   │   ├── logo.svg
│   │   ├── placeholder-product.png
│   │   └── icons/
│   ├── fonts/
│   └── locales/                                    # 废弃（移到messages/）
│
├── messages/                                       # 多语言翻译文件
│   ├── en.json                                     # 英语
│   ├── id.json                                     # 印尼语
│   ├── my.json                                     # 马来语
│   ├── zh-CN.json                                  # 简体中文
│   └── zh-TW.json                                  # 繁体中文
│
├── .env.local                                      # 环境变量（本地）
├── .env.development                                # 开发环境变量
├── .env.production                                 # 生产环境变量
├── next.config.js                                  # Next.js配置
├── tailwind.config.ts                              # Tailwind配置
├── tsconfig.json                                   # TypeScript配置
├── postcss.config.js                               # PostCSS配置
├── package.json                                    # 依赖配置
├── Dockerfile                                      # Docker镜像
└── README.md
```

#### 2.6 package.json 依赖配置

```json
{
  "name": "tradecraft-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.3.3",

    "tailwindcss": "3.4.1",
    "autoprefixer": "10.4.16",
    "postcss": "8.4.33",

    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",

    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.307.0",

    "zustand": "4.4.7",
    "immer": "^10.0.3",

    "react-hook-form": "7.49.3",
    "zod": "3.22.4",
    "@hookform/resolvers": "^3.3.4",

    "axios": "1.6.5",
    "swr": "2.2.4",

    "next-intl": "3.4.5",
    "date-fns": "3.0.6",

    "@stripe/stripe-js": "2.4.0",
    "@stripe/react-stripe-js": "2.5.0",
    "@paypal/react-paypal-js": "8.1.3",

    "recharts": "^2.10.3",
    "react-chartjs-2": "^5.2.0",
    "chart.js": "^4.4.1",

    "react-dropzone": "^14.2.3",
    "react-image-crop": "^10.1.8",
    "sharp": "^0.33.1"
  },
  "devDependencies": {
    "@types/node": "20.10.7",
    "@types/react": "18.2.47",
    "@types/react-dom": "18.2.18",
    "eslint": "8.56.0",
    "eslint-config-next": "14.1.0",
    "prettier": "3.1.1",
    "prettier-plugin-tailwindcss": "^0.5.10"
  }
}
```

#### 2.7 FastAPI项目初始化

```bash
cd ai-service
mkdir fastapi-ai-service && cd fastapi-ai-service
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
```

#### 2.8 AI服务项目结构（详细）

```
ai-service/
├── app/
│   ├── main.py                                     # FastAPI应用入口
│   │
│   ├── api/                                        # API路由
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── content_generation.py               # 内容生成路由
│   │   │   ├── translation.py                      # 翻译路由
│   │   │   ├── image_processing.py                 # 图片处理路由
│   │   │   └── tasks.py                            # 任务状态查询路由
│   │   │
│   │   └── deps.py                                 # 依赖注入
│   │
│   ├── services/                                   # 业务逻辑
│   │   ├── __init__.py
│   │   ├── ai/
│   │   │   ├── __init__.py
│   │   │   ├── wenxin_client.py                    # 文心一言客户端
│   │   │   ├── glm_client.py                       # GLM-4客户端
│   │   │   ├── qianwen_client.py                   # 通义千问客户端
│   │   │   └── prompt_builder.py                   # Prompt构建器
│   │   │
│   │   ├── translation/
│   │   │   ├── __init__.py
│   │   │   ├── azure_translator.py                 # Azure翻译
│   │   │   ├── google_translator.py                # Google翻译
│   │   │   └── translator_factory.py               # 翻译器工厂
│   │   │
│   │   ├── content/
│   │   │   ├── __init__.py
│   │   │   ├── generator.py                        # 内容生成器
│   │   │   ├── validator.py                        # 内容验证器
│   │   │   ├── quality_checker.py                  # 质量检查器
│   │   │   └── sensitive_word_filter.py            # 敏感词过滤
│   │   │
│   │   ├── image/
│   │   │   ├── __init__.py
│   │   │   ├── compressor.py                       # 图片压缩
│   │   │   ├── resizer.py                          # 图片缩放
│   │   │   └── watermark.py                        # 水印添加
│   │   │
│   │   └── task/
│   │       ├── __init__.py
│   │       ├── task_manager.py                     # 任务管理器
│   │       ├── worker.py                           # 任务Worker
│   │       └── scheduler.py                        # 任务调度器
│   │
│   ├── models/                                     # Pydantic模型
│   │   ├── __init__.py
│   │   ├── request/
│   │   │   ├── __init__.py
│   │   │   ├── content_generation.py               # 内容生成请求
│   │   │   ├── translation.py                      # 翻译请求
│   │   │   └── image_processing.py                 # 图片处理请求
│   │   │
│   │   ├── response/
│   │   │   ├── __init__.py
│   │   │   ├── content_generation.py               # 内容生成响应
│   │   │   ├── translation.py                      # 翻译响应
│   │   │   ├── task.py                             # 任务状态响应
│   │   │   └── base.py                             # 基础响应模型
│   │   │
│   │   └── domain/
│   │       ├── __init__.py
│   │       ├── product_content.py                  # 商品内容模型
│   │       ├── task.py                             # 任务模型
│   │       └── enums.py                            # 枚举类型
│   │
│   ├── core/                                       # 核心配置
│   │   ├── __init__.py
│   │   ├── config.py                               # 配置管理
│   │   ├── security.py                             # 安全配置
│   │   ├── logging.py                              # 日志配置
│   │   └── redis.py                                # Redis连接
│   │
│   ├── utils/                                      # 工具函数
│   │   ├── __init__.py
│   │   ├── cache.py                                # 缓存工具
│   │   ├── http_client.py                          # HTTP客户端
│   │   ├── json_parser.py                          # JSON解析
│   │   └── text_processor.py                       # 文本处理
│   │
│   └── constants/                                  # 常量
│       ├── __init__.py
│       ├── prompts.py                              # Prompt模板
│       ├── languages.py                            # 语言配置
│       └── sensitive_words.py                      # 敏感词库
│
├── tests/                                          # 测试
│   ├── __init__.py
│   ├── test_content_generation.py
│   ├── test_translation.py
│   └── test_image_processing.py
│
├── requirements.txt                                # 依赖
├── Dockerfile                                      # Docker镜像
├── .env                                            # 环境变量
└── README.md
```

#### 2.9 requirements.txt 依赖配置

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
pydantic-settings==2.1.0

# HTTP客户端
httpx==0.26.0
requests==2.31.0

# 异步任务
celery==5.3.4
redis==5.0.1

# 图片处理
Pillow==10.2.0

# AI客户端
openai==1.6.0
anthropic==0.8.1

# 翻译
google-cloud-translate==3.14.0
azure-ai-translation-text==1.0.0

# 工具
python-dotenv==1.0.0
python-multipart==0.0.6
email-validator==2.1.0

# 测试
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.26.0
```

---

## 二、数据库设计与基础架构（Week 1-2，Day 3-10）

### Day 3-5: 数据库设计与Flyway迁移

#### 3.1 创建Flyway迁移脚本

**V1__Create_users_tables.sql**:
```sql
-- 用户表
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'BUYER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- 用户资料表
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    language VARCHAR(10) DEFAULT 'en',
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- 收货地址表
CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(10) NOT NULL,
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
CREATE INDEX idx_addresses_is_default ON addresses(user_id, is_default);

-- 更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为users表添加触发器
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为user_profiles表添加触发器
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为addresses表添加触发器
CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**V2__Create_products_tables.sql**:
```sql
-- 商品分类表
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT REFERENCES categories(id),
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
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- 商品表
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    sku VARCHAR(100) UNIQUE NOT NULL,

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

    -- 多语言卖点（JSON数组）
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
    keywords_en JSONB,
    keywords_id JSONB,

    -- 定价（基准货币：人民币）
    price_cny DECIMAL(10, 2) NOT NULL,
    cost_price_cny DECIMAL(10, 2) NOT NULL,

    -- 库存
    stock INT NOT NULL DEFAULT 0,
    stock_alert_threshold INT DEFAULT 10,

    -- 图片（JSON）
    images JSONB NOT NULL,

    -- 物流信息
    weight_grams INT,
    dimensions JSONB,
    is_fragile BOOLEAN DEFAULT FALSE,
    requires_halal_cert BOOLEAN DEFAULT FALSE,

    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',

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
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- 全文搜索索引
CREATE INDEX idx_products_name_en_fts ON products
    USING gin(to_tsvector('english', name_en));
CREATE INDEX idx_products_name_id_fts ON products
    USING gin(to_tsvector('indonesian', name_id));

-- 商品SKU表
CREATE TABLE product_skus (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,

    -- 规格属性（JSON）
    attributes JSONB NOT NULL,

    -- 定价（可选）
    price_cny DECIMAL(10, 2),

    -- 库存
    stock INT NOT NULL DEFAULT 0,

    -- 图片（可选）
    image_url VARCHAR(500),

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_skus_product_id ON product_skus(product_id);
CREATE INDEX idx_product_skus_sku ON product_skus(sku);

-- 触发器
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_skus_updated_at
    BEFORE UPDATE ON product_skus
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**V3__Create_orders_tables.sql**:
```sql
-- 订单表
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),

    -- 收货信息
    shipping_recipient VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(50) NOT NULL,
    shipping_country VARCHAR(10) NOT NULL,
    shipping_province VARCHAR(100) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_address VARCHAR(500) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,

    -- 金额
    currency VARCHAR(10) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    cod_fee DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,

    -- 支付信息
    payment_method VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_transaction_id VARCHAR(255),
    paid_at TIMESTAMP,

    -- 配送信息
    shipping_method VARCHAR(20) NOT NULL,
    shipping_carrier VARCHAR(50),
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,

    -- 订单状态
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_PAYMENT',

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
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- 订单项表
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    product_sku_id BIGINT REFERENCES product_skus(id),

    -- 商品快照
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    product_image_url VARCHAR(500),
    sku_attributes JSONB,

    -- 价格数量
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- 订单状态历史表
CREATE TABLE order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    note TEXT,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- 购物车表
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

-- 触发器
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**V4__Insert_initial_data.sql**:
```sql
-- 插入初始分类
INSERT INTO categories (name_en, name_id, name_my, name_zh_cn, name_zh_tw, slug, parent_id, display_order) VALUES
-- 一级分类
('Electronics', 'Elektronik', 'Elektronik', '电子产品', '電子產品', 'electronics', NULL, 1),
('Fashion', 'Fashion', 'Fesyen', '时尚服饰', '時尚服飾', 'fashion', NULL, 2),
('Beauty & Personal Care', 'Kecantikan & Perawatan Pribadi', 'Kecantikan & Penjagaan Diri', '美妆个护', '美妝個護', 'beauty', NULL, 3),
('Home & Living', 'Rumah & Hidup', 'Rumah & Kehidupan', '家居生活', '家居生活', 'home', NULL, 4),
('Sports & Outdoors', 'Olahraga & Luar Ruangan', 'Sukan & Luar', '运动户外', '運動戶外', 'sports', NULL, 5);

-- 二级分类（Electronics）
INSERT INTO categories (name_en, name_id, name_my, name_zh_cn, name_zh_tw, slug, parent_id, display_order) VALUES
('Mobile Accessories', 'Aksesori Ponsel', 'Aksesori Mudah Alih', '手机配件', '手機配件', 'mobile-accessories', 1, 1),
('Audio & Headphones', 'Audio & Headphone', 'Audio & Fon Kepala', '音频耳机', '音頻耳機', 'audio-headphones', 1, 2),
('Smart Watches', 'Jam Tangan Pintar', 'Jam Tangan Pintar', '智能手表', '智能手錶', 'smart-watches', 1, 3);

-- 二级分类（Fashion）
INSERT INTO categories (name_en, name_id, name_my, name_zh_cn, name_zh_tw, slug, parent_id, display_order) VALUES
('Women Clothing', 'Pakaian Wanita', 'Pakaian Wanita', '女装', '女裝', 'women-clothing', 2, 1),
('Men Clothing', 'Pakaian Pria', 'Pakaian Lelaki', '男装', '男裝', 'men-clothing', 2, 2),
('Bags & Accessories', 'Tas & Aksesoris', 'Beg & Aksesori', '包包配饰', '包包配飾', 'bags-accessories', 2, 3);

-- 插入测试用户（密码: password123）
-- bcrypt哈希: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyAJ3oTpzcmm
INSERT INTO users (email, password_hash, role, status) VALUES
('admin@tradecraft.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyAJ3oTpzcmm', 'ADMIN', 'ACTIVE'),
('seller@tradecraft.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyAJ3oTpzcmm', 'SELLER', 'ACTIVE'),
('buyer@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyAJ3oTpzcmm', 'BUYER', 'ACTIVE');

-- 插入用户资料
INSERT INTO user_profiles (user_id, first_name, last_name, language, currency) VALUES
(1, 'Admin', 'User', 'en', 'USD'),
(2, 'Seller', 'User', 'zh-CN', 'CNY'),
(3, 'Buyer', 'User', 'en', 'USD');
```

#### 3.2 运行Flyway迁移

```bash
# 在backend/目录下
./mvnw flyway:migrate

# 验证迁移
./mvnw flyway:info
```

---

### Day 6-8: Spring Boot基础架构

#### 6.1 配置文件（application.yml）

```yaml
spring:
  application:
    name: tradecraft-api

  profiles:
    active: ${SPRING_PROFILES_ACTIVE:dev}

  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:ecommerce}
    username: ${DB_USER:ecommerce_user}
    password: ${DB_PASSWORD:password123}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true

  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      database: 0
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 2

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

# JWT配置
jwt:
  secret: ${JWT_SECRET:your-secret-key-change-this-in-production-min-256-bits}
  expiration: 604800000  # 7天

# 阿里云OSS配置
aliyun:
  oss:
    endpoint: ${ALIYUN_OSS_ENDPOINT:oss-ap-southeast-1.aliyuncs.com}
    bucket: ${ALIYUN_OSS_BUCKET:tradecraft-assets}
    access-key-id: ${ALIYUN_ACCESS_KEY_ID:}
    access-key-secret: ${ALIYUN_ACCESS_KEY_SECRET:}
    base-url: ${ALIYUN_OSS_BASE_URL:https://tradecraft-assets.oss-ap-southeast-1.aliyuncs.com}

# Stripe配置
stripe:
  secret-key: ${STRIPE_SECRET_KEY:sk_test_xxx}
  webhook-secret: ${STRIPE_WEBHOOK_SECRET:whsec_xxx}

# PayPal配置
paypal:
  client-id: ${PAYPAL_CLIENT_ID:}
  client-secret: ${PAYPAL_CLIENT_SECRET:}
  mode: ${PAYPAL_MODE:sandbox}

# Meilisearch配置
meilisearch:
  host: ${SEARCH_HOST:localhost}
  port: ${SEARCH_PORT:7700}
  api-key: ${SEARCH_API_KEY:masterKey123}

# FastAPI AI服务配置
ai-service:
  base-url: ${AI_SERVICE_URL:http://localhost:8000}

# Swagger配置
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true

# 日志配置
logging:
  level:
    root: INFO
    com.tradecraft: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

#### 6.2 核心实体类示例

**User.java**:
```java
package com.tradecraft.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    // 关联关系
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserProfile profile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Order> orders = new ArrayList<>();
}
```

**Product.java**:
```java
package com.tradecraft.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(unique = true, nullable = false)
    private String sku;

    // 多语言名称
    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(name = "name_id", nullable = false)
    private String nameId;

    @Column(name = "name_my", nullable = false)
    private String nameMy;

    @Column(name = "name_zh_cn", nullable = false)
    private String nameZhCn;

    @Column(name = "name_zh_tw", nullable = false)
    private String nameZhTw;

    // 多语言描述
    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_id", columnDefinition = "TEXT")
    private String descriptionId;

    @Column(name = "description_my", columnDefinition = "TEXT")
    private String descriptionMy;

    @Column(name = "description_zh_cn", columnDefinition = "TEXT")
    private String descriptionZhCn;

    @Column(name = "description_zh_tw", columnDefinition = "TEXT")
    private String descriptionZhTw;

    // 多语言卖点（JSONB）
    @Type(JsonBinaryType.class)
    @Column(name = "features_en", columnDefinition = "jsonb")
    private List<String> featuresEn;

    @Type(JsonBinaryType.class)
    @Column(name = "features_id", columnDefinition = "jsonb")
    private List<String> featuresId;

    // SEO字段（部分）
    @Column(name = "seo_title_en")
    private String seoTitleEn;

    @Column(name = "seo_title_id")
    private String seoTitleId;

    @Type(JsonBinaryType.class)
    @Column(name = "keywords_en", columnDefinition = "jsonb")
    private List<String> keywordsEn;

    // 定价
    @Column(name = "price_cny", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceCny;

    @Column(name = "cost_price_cny", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPriceCny;

    // 库存
    @Column(nullable = false)
    private Integer stock;

    @Column(name = "stock_alert_threshold")
    private Integer stockAlertThreshold;

    // 图片（JSONB）
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> images;

    // 物流信息
    @Column(name = "weight_grams")
    private Integer weightGrams;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Integer> dimensions;

    @Column(name = "is_fragile")
    private Boolean isFragile;

    @Column(name = "requires_halal_cert")
    private Boolean requiresHalalCert;

    // 状态
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status;

    // 统计
    @Column(name = "sales_count")
    private Integer salesCount = 0;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    // 关联关系
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductSku> skus = new ArrayList<>();

    // 工具方法
    public String getNameByLocale(String locale) {
        return switch (locale) {
            case "id" -> nameId;
            case "my" -> nameMy;
            case "zh-CN" -> nameZhCn;
            case "zh-TW" -> nameZhTw;
            default -> nameEn;
        };
    }

    public String getDescriptionByLocale(String locale) {
        return switch (locale) {
            case "id" -> descriptionId;
            case "my" -> descriptionMy;
            case "zh-CN" -> descriptionZhCn;
            case "zh-TW" -> descriptionZhTw;
            default -> descriptionEn;
        };
    }
}
```

**Order.java**:
```java
package com.tradecraft.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 收货信息
    @Column(name = "shipping_recipient", nullable = false)
    private String shippingRecipient;

    @Column(name = "shipping_phone", nullable = false)
    private String shippingPhone;

    @Column(name = "shipping_country", nullable = false)
    private String shippingCountry;

    @Column(name = "shipping_province", nullable = false)
    private String shippingProvince;

    @Column(name = "shipping_city", nullable = false)
    private String shippingCity;

    @Column(name = "shipping_address", nullable = false, length = 500)
    private String shippingAddress;

    @Column(name = "shipping_postal_code", nullable = false)
    private String shippingPostalCode;

    // 金额
    @Column(nullable = false)
    private String currency;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee;

    @Column(name = "cod_fee", precision = 10, scale = 2)
    private BigDecimal codFee;

    @Column(precision = 10, scale = 2)
    private BigDecimal discount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    // 支付信息
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;

    @Column(name = "payment_transaction_id")
    private String paymentTransactionId;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    // 配送信息
    @Enumerated(EnumType.STRING)
    @Column(name = "shipping_method", nullable = false)
    private ShippingMethod shippingMethod;

    @Column(name = "shipping_carrier")
    private String shippingCarrier;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    // 订单状态
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    // 备注
    @Column(name = "customer_note", columnDefinition = "TEXT")
    private String customerNote;

    @Column(name = "seller_note", columnDefinition = "TEXT")
    private String sellerNote;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 关联关系
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderStatusHistory> statusHistory = new ArrayList<>();

    // 工具方法
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void addStatusHistory(OrderStatusHistory history) {
        statusHistory.add(history);
        history.setOrder(this);
    }
}
```

**续（更多内容请继续...）**

由于文档篇幅限制，我已经创建了详细开发计划的前半部分。让我继续创建完整的文档...
