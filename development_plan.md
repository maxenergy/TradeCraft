# 跨境电商AI自动化平台 - 详细开发计划

本文档基于 PRD v1.0 和 TDD v1.0，为为期3个月的MVP开发周期提供一个详细的、可执行的任务分解计划。

**开发团队**: 1人 (全栈工程师)
**开发周期**: 12周

---

## Week 1-2: 项目启动、核心架构与数据库设计

**目标**: 完成项目初始化，搭建前后端基础架构，设计并实现核心数据模型，确保开发环境就绪。

### Day 1-2: 项目初始化
- **任务**: 初始化所有项目仓库和配置文件。
- **后端 (Spring Boot)**:
    - `pom.xml`: 添加 `spring-boot-starter-web`, `data-jpa`, `postgresql`, `security`, `lombok` 等核心依赖。
    - `application.yml`: 配置服务器端口、数据库连接（dev profile）。
    - 创建主启动类 `EcommerceApplication.java`。
- **前端 (Next.js)**:
    - `package.json`: 初始化 Next.js 14 (App Router) 项目，添加 `tailwindcss`, `typescript`, `eslint`。
    - `tailwind.config.js`: 配置 Tailwind CSS。
    - `tsconfig.json`: 配置 TypeScript。
    - `next.config.js`: 基础配置。
- **AI 服务 (FastAPI)**:
    - `requirements.txt`: 添加 `fastapi`, `uvicorn`, `pydantic`。
    - `main.py`: 创建 FastAPI app 实例。
- **版本控制 (Git)**:
    - 创建 Git 仓库，初始化 `main` 和 `develop` 分支。
    - 配置 `.gitignore` 文件。

### Day 3-5: 数据库设计与迁移
- **任务**: 根据 TDD 设计数据库表结构，并使用 Flyway 进行版本管理。
- **数据库 (PostgreSQL)**:
    - **Flyway V1__Create_core_tables.sql**:
        - `users`: 用户表
        - `user_profiles`: 用户资料表
        - `addresses`: 收货地址表
        - `categories`: 商品分类表
        - `products`: 商品主表 (包含多语言字段和JSONB)
        - `product_skus`: 商品多规格SKU表
        - `orders`: 订单表
        - `order_items`: 订单项表
        - `order_status_history`: 订单状态历史表
- **后端 (Spring Boot)**:
    - **Entity 层 (`com.ecommerce.entity`)**:
        - 创建 `User.java`, `UserProfile.java`, `Address.java`, `Category.java`, `Product.java`, `ProductSku.java`, `Order.java`, `OrderItem.java`, `OrderStatusHistory.java` 等所有核心实体类。
        - 使用 `@Entity`, `@Table`, `@Id`, `@Column`, `@ManyToOne`, `@OneToMany` 等 JPA 注解定义表关系。

### Day 6-8: 核心后端架构
- **任务**: 搭建 Spring Boot 项目的核心层，包括配置、安全和数据访问。
- **后端 (Spring Boot)**:
    - **Repository 层 (`com.ecommerce.repository`)**:
        - 为每个 Entity 创建对应的 Repository 接口，继承 `JpaRepository`。
        - 例如: `UserRepository.java`, `ProductRepository.java`, `OrderRepository.java`。
    - **Security 配置 (`com.ecommerce.config.SecurityConfig.java`)**:
        - 配置 `SecurityFilterChain` Bean。
        - 定义基础的认证规则（例如：暂时允许所有请求，或配置 in-memory user）。
        - 配置 `PasswordEncoder` Bean (使用 BCrypt)。
    - **DTO & Mapper (`com.ecommerce.dto`, `com.ecommerce.mapper`)**:
        - (可选，初期可省略) 为 User, Product 等实体定义 DTO。
        - (可选) 使用 MapStruct 定义 Mapper 接口。
    - **全局配置**:
        - `GlobalExceptionHandler.java`: 处理通用异常。
        - `WebConfig.java`: 配置 CORS。

### Day 9-10: 核心前端架构与开发环境
- **任务**: 搭建 Next.js 项目的核心结构，并配置好本地开发环境。
- **前端 (Next.js)**:
    - **UI 组件库**:
        - `npx shadcn-ui@latest init`: 集成 Shadcn/ui。
        - 添加 `Button`, `Input`, `Card` 等基础组件。
    - **布局 (`/app/[locale]/layout.tsx`)**:
        - 创建 `Header.tsx`, `Footer.tsx` 组件。
        - 在根布局中使用。
    - **多语言 (`next-intl`)**:
        - `npm install next-intl`
        - 创建 `/messages/en.json`, `zh-CN.json` 等翻译文件。
        - 配置 `i18n.ts` 和 `middleware.ts`。
    - **API 客户端 (`/lib/api.ts`)**:
        - 使用 `axios` 创建一个 API client 实例，配置 baseURL。
- **DevOps (Docker)**:
    - `docker-compose.yml`:
        - 创建 `postgres` service，配置数据库、用户、密码和数据卷。
        - 创建 `redis` service。
        - 创建 `meilisearch` service。
    - 确保所有服务能一键启动 (`docker-compose up`)。

---

## Week 3-4: 商品管理模块 (核心功能)

**目标**: 实现完整的商品管理功能，包括手动的商品增删改查、图片上传，以及最核心的AI内容生成。

### Day 11-13: 商品 CRUD 后端
- **任务**: 开发商品管理的后端 RESTful API。
- **后端 (Spring Boot)**:
    - **Service 层 (`com.ecommerce.service.ProductService.java`)**:
        - `createProduct(ProductCreateDTO dto)`: 创建商品。
        - `getProductById(Long id)`: 获取商品详情。
        - `updateProduct(Long id, ProductUpdateDTO dto)`: 更新商品。
        - `deleteProduct(Long id)`: 删除商品。
        - `listProducts(Pageable pageable, ProductFilter filter)`: 分页和筛选查询商品列表。
    - **Controller 层 (`com.ecommerce.controller.admin.ProductController.java`)**:
        - `POST /api/v1/admin/products`: 调用 `createProduct`。
        - `GET /api/v1/admin/products/{id}`: 调用 `getProductById`。
        - `PUT /api/v1/admin/products/{id}`: 调用 `updateProduct`。
        - `DELETE /api/v1/admin/products/{id}`: 调用 `deleteProduct`。
        - `GET /api/v1/admin/products`: 调用 `listProducts`。
    - **DTOs (`com.ecommerce.dto.product`)**:
        - `ProductCreateDTO`, `ProductUpdateDTO`, `ProductViewDTO`, `ProductListDTO`。

### Day 14-16: 商品管理前端
- **任务**: 开发管理后台的商品管理界面。
- **前端 (Next.js)**:
    - **页面 (`/app/admin/products`)**:
        - `page.tsx`: 商品列表页，使用 `react-data-table-component` 或自定义表格展示商品。
        - `/add/page.tsx`: 添加新商品页。
        - `/[id]/edit/page.tsx`: 编辑商品页。
    - **组件 (`/components/admin/product`)**:
        - `ProductForm.tsx`: 可复用的商品表单组件，用于创建和编辑。
        - `ProductTable.tsx`: 商品列表格。
        - `ImageUploader.tsx`: 图片上传组件。
    - **状态管理**:
        - 使用 React Hook Form 管理复杂的商品表单。

### Day 17-18: 图片上传 (OSS)
- **任务**: 实现图片上传到阿里云OSS。
- **后端 (Spring Boot)**:
    - **Service (`com.ecommerce.service.OssService.java`)**:
        - `generatePresignedUrl(String objectName)`: 生成用于前端直传的签名URL。
    - **Controller (`com.ecommerce.controller.admin.FileController.java`)**:
        - `GET /api/v1/admin/files/presigned-url`: 供前端调用以获取签名URL。
- **前端 (Next.js)**:
    - **`ImageUploader.tsx` 组件**:
        - 调用后端获取 presigned URL。
        - 使用 `fetch` 或 `axios` 将文件直接 `PUT` 到返回的 URL。
        - 显示上传进度和成功后的图片预览。

### Day 19-20: AI 内容生成
- **任务**: 对接AI服务，实现一键生成多语言商品内容。
- **AI 服务 (FastAPI)**:
    - **`routers/content_generation.py`**:
        - `POST /api/v1/generate-content`: 接收商品信息，返回生成的内容。
    - **`services/ai_client.py`**:
        - 封装对文心一言、GLM-4、Azure Translator 的调用逻辑。
        - 实现 `generate_chinese_content`, `translate_to_english`, `translate_via_azure` 等方法。
- **后端 (Spring Boot)**:
    - **Service (`com.ecommerce.service.AIContentService.java`)**:
        - `triggerContentGeneration(Long productId, GenerationRequestDTO dto)`: 调用 FastAPI 服务，并将任务放入 Redis 队列（异步）。
    - **Controller (`com.ecommerce.controller.admin.ProductController.java`)**:
        - `POST /api/v1/admin/products/{id}/generate-content`: 触发AI内容生成。
- **前端 (Next.js)**:
    - 在商品编辑页面添加 "AI 生成内容" 按钮。
    - 点击后调用后端API，并轮询任务状态，成功后将内容填充到表单中。

---

## Week 5-6: 独立站前台基础 & 购物流程

**目标**: 搭建面向买家的独立站核心页面，包括首页、商品列表页、详情页和购物车，实现完整的浏览和加购流程。

### Day 21-23: 首页与商品列表页
- **任务**: 开发独立站的首页和商品列表页，允许用户浏览和发现商品。
- **后端 (Spring Boot)**:
    - **Controller (`com.ecommerce.controller.storefront.ProductController.java`)**:
        - `GET /api/v1/storefront/products`: 查询已发布的商品，支持分页、分类筛选、价格排序。
        - `GET /api/v1/storefront/categories`: 获取分类列表。
    - **Service (`com.ecommerce.service.ProductService.java`)**:
        - 扩展 `listProducts` 方法以支持前台查询逻辑。
- **前端 (Next.js)**:
    - **页面 (`/app/[locale]`)**:
        - `page.tsx`: 首页，包括 Banner, Featured Products, Categories 板块。
        - `/products/page.tsx`: 商品列表页。
    - **组件 (`/components/storefront`)**:
        - `HeroBanner.tsx`: 首页轮播图。
        - `ProductCard.tsx`: 商品卡片组件。
        - `ProductGrid.tsx`: 商品网格布局。
        - `ProductFilterSidebar.tsx`: 商品筛选侧边栏。
        - `Pagination.tsx`: 分页组件。

### Day 24-26: 商品详情页
- **任务**: 开发商品详情页，展示商品完整信息并支持规格选择。
- **后端 (Spring Boot)**:
    - **Controller (`com.ecommerce.controller.storefront.ProductController.java`)**:
        - `GET /api/v1/storefront/products/{id}`: 获取单个商品详情，包含 SKU 信息。
- **前端 (Next.js)**:
    - **页面 (`/app/[locale]/products/[id]/page.tsx`)**:
        - 商品详情页，左右布局（左侧图片，右侧信息）。
    - **组件 (`/components/product`)**:
        - `ImageGallery.tsx`: 商品图片展示，支持缩略图点击切换和放大。
        - `VariantSelector.tsx`: 多规格（如颜色、尺寸）选择器。
        - `QuantitySelector.tsx`: 商品数量增减器。
        - `AddToCartButton.tsx`: "加入购物车" 按钮。

### Day 27-28: 多语言与多货币
- **任务**: 实现前台的多语言和多货币切换功能。
- **后端 (Spring Boot)**:
    - **Currency Service ( `com.ecommerce.service.CurrencyService.java`)**:
        - `convertPrice(BigDecimal price, String from, String to)`: 调用第三方API（如 ExchangeRate-API）并结合Redis缓存进行汇率换算。
    - API 需根据请求头或参数返回对应语言和货币的数据。
- **前端 (Next.js)**:
    - **组件 (`/components/layout`)**:
        - `LanguageSwitcher.tsx`: 语言切换下拉菜单。
        - `CurrencySwitcher.tsx`: 货币切换下拉菜单。
    - **状态管理 (`/store/settingsStore.ts`)**:
        - 使用 Zustand 创建 `settingsStore`，管理全局的 `locale` 和 `currency`。
        - 将用户选择持久化到 localStorage。
    - **价格显示 (`/lib/currency.ts`)**:
        - 创建 `formatPrice` 工具函数，用于格式化不同货币的显示。

### Day 29-30: 购物车
- **任务**: 实现完整的购物车功能。
- **后端 (Spring Boot)**:
    - **Entity (`CartItem.java`)**: (如果选择数据库存储购物车)
    - **Controller (`com.ecommerce.controller.storefront.CartController.java`)**:
        - `GET /api/v1/cart`: 获取购物车内容。
        - `POST /api/v1/cart/items`: 添加商品到购物车。
        - `PUT /api/v1/cart/items/{id}`: 修改商品数量。
        - `DELETE /api/v1/cart/items/{id}`: 删除商品。
- **前端 (Next.js)**:
    - **页面 (`/app/[locale]/cart/page.tsx`)**: 购物车详情页。
    - **状态管理 (`/store/cartStore.ts`)**:
        - 使用 Zustand 创建 `cartStore`，在客户端管理购物车状态。
        - `addToCart`, `removeFromCart`, `updateQuantity` 等 actions。
        - 状态与 localStorage 同步，实现持久化购物车。
    - **组件 (`/components/cart`)**:
        - `CartIcon.tsx`: 导航栏的购物车图标，实时显示商品数量。
        - `CartItem.tsx`: 购物车中的单个商品项。
        - `CartSummary.tsx`: 购物车合计信息。

---

## Week 7-8: 用户认证 & 订单模块

**目标**: 实现用户注册、登录功能，并开发完整的下单结账流程以及后台的订单管理功能。

### Day 31-33: 用户认证 (JWT)
- **任务**: 实现基于 JWT 的用户注册和登录功能。
- **后端 (Spring Boot)**:
    - **Security (`com.ecommerce.security`)**:
        - `JwtTokenProvider.java`: 生成、解析和验证 JWT token。
        - `UserDetailsServiceImpl.java`: 实现 `UserDetailsService` 接口，用于从数据库加载用户信息。
        - `JwtAuthenticationFilter.java`: 拦截请求，从 Header 中解析 Token 并设置 Spring Security 上下文。
    - **Service (`com.ecommerce.service.UserService.java`)**:
        - `register(UserRegisterDTO dto)`: 处理用户注册逻辑，包括密码加密。
        - `login(UserLoginDTO dto)`: 处理登录逻辑，成功后返回 JWT。
    - **Controller (`com.ecommerce.controller.auth.AuthController.java`)**:
        - `POST /api/v1/auth/register`: 注册接口。
        - `POST /api/v1/auth/login`: 登录接口。
        - `GET /api/v1/auth/me`: 获取当前登录用户信息接口。
- **前端 (Next.js)**:
    - **页面 (`/app/[locale]/auth`)**:
        - `/login/page.tsx`: 登录页。
        - `/register/page.tsx`: 注册页。
    - **状态管理 (`/store/userStore.ts`)**:
        - Zustand `userStore` 用于存储用户信息和 JWT token。
        - `login`, `register`, `logout` 等 actions。
        - Token 持久化到 Cookie 或 localStorage。
    - **高阶组件/Hook (`/hooks/useAuth.ts`)**:
        - 创建 `useAuth` hook 来保护需要登录的页面/组件。

### Day 34-36: 结账流程
- **任务**: 开发单页结账流程，包括地址填写、支付方式选择。
- **后端 (Spring Boot)**:
    - **Service (`com.ecommerce.service.OrderService.java`)**:
        - `createOrder(OrderCreateDTO dto)`: 核心方法，处理订单创建，包括：
            - 验证库存。
            - 计算总价。
            - 创建订单和订单项。
            - (关键) 减库存 (需要事务保证)。
    - **Controller (`com.ecommerce.controller.storefront.CheckoutController.java`)**:
        - `POST /api/v1/checkout`: 创建订单接口。
- **前端 (Next.js)**:
    - **页面 (`/app/[locale]/checkout/page.tsx`)**:
        - 单页结账页面，包含收货地址、配送方式、支付方式、订单汇总等模块。
    - **组件 (`/components/checkout`)**:
        - `ShippingAddressForm.tsx`: 收货地址表单。
        - `PaymentMethodSelector.tsx`: 支付方式选择器。
        - `OrderSummary.tsx`: 订单汇总信息。

### Day 37-38: 个人中心
- **任务**: 开发用户个人中心，管理地址和查看订单。
- **前端 (Next.js)**:
    - **页面 (`/app/[locale]/account`)**:
        - `/profile/page.tsx`: 个人信息。
        - `/addresses/page.tsx`: 收货地址管理。
        - `/orders/page.tsx`: 我的订单列表。
        - `/orders/[id]/page.tsx`: 订单详情页。
    - **后端**: 为以上页面提供相应的 API (如 `AddressController`, `OrderController`)。

### Day 39-40: 订单管理 (管理后台)
- **任务**: 开发卖家用于查看和处理订单的管理后台功能。
- **后端 (Spring Boot)**:
    - **Service (`com.ecommerce.service.OrderService.java`)**:
        - `listOrdersAdmin(Pageable pageable, OrderFilter filter)`: 查询订单列表（后台）。
        - `getOrderDetailsAdmin(Long id)`: 获取订单详情（后台）。
        - `shipOrder(Long id, ShippingInfoDTO dto)`: 标记订单为已发货。
        - `cancelOrder(Long id)`: 取消订单。
    - **Controller (`com.ecommerce.controller.admin.OrderController.java`)**:
        - 为以上 Service 方法创建对应的 API 端点。
- **前端 (Next.js)**:
    - **页面 (`/app/admin/orders`)**:
        - `page.tsx`: 订单列表页。
        - `/[id]/page.tsx`: 订单详情页。
    - **组件 (`/components/admin/order`)**:
        - `OrderTable.tsx`: 订单列表格。
        - `OrderDetails.tsx`: 订单详情展示。
        - `ShipOrderModal.tsx`: 用于输入物流信息的发货弹窗。

---

## Week 9-10: 支付集成 & 邮件通知

**目标**: 集成 Stripe, PayPal 和 COD 三种支付方式，并配置好关键业务节点的邮件通知功能。

### Day 41-43: Stripe 支付集成
- **任务**: 集成 Stripe 实现信用卡支付。
- **后端 (Spring Boot)**:
    - **Service (`com.ecommerce.service.PaymentService.java`)**:
        - `createStripePaymentIntent(Order order)`: 创建 Stripe `PaymentIntent` 并返回 `client_secret`。
        - `handleStripeWebhook(String payload, String signature)`: 处理 Stripe Webhook 事件 (如 `payment_intent.succeeded`)，并更新订单状态。
    - **Controller (`com.ecommerce.controller.webhook.StripeWebhookController.java`)**:
        - `POST /api/v1/webhook/stripe`: 接收 Webhook。
- **前端 (Next.js)**:
    - **依赖**: `npm install @stripe/react-stripe-js @stripe/stripe-js`
    - **组件 (`/components/checkout`)**:
        - `StripePaymentForm.tsx`: 使用 Stripe Elements (CardElement) 创建一个安全的支付表单。
    - **结账页面逻辑**:
        - 在创建订单后，使用返回的 `client_secret` 调用 `stripe.confirmCardPayment` 来完成支付。

### Day 44-45: PayPal 支付集成
- **任务**: 集成 PayPal 实现支付。
- **后端 (Spring Boot)**:
    - **Service (`com.ecommerce.service.PaymentService.java`)**:
        - `createPayPalOrder(Order order)`: 调用 PayPal API 创建订单。
        - `capturePayPalOrder(String payPalOrderId)`: 在用户授权后，捕获支付并更新订单状态。
    - **Controller (`com.ecommerce.controller.storefront.PaymentController.java`)**:
        - `POST /api/v1/payments/paypal/create`: 创建 PayPal 订单。
        - `POST /api/v1/payments/paypal/{orderId}/capture`: 捕获 PayPal 支付。
- **前端 (Next.js)**:
    - **依赖**: `npm install @paypal/react-paypal-js`
    - **组件 (`/components/checkout`)**:
        - `PayPalButtons.tsx`: 使用 `@paypal/react-paypal-js` 提供的组件。
        - 在 `createOrder` prop 中调用后端创建 PayPal 订单。
        - 在 `onApprove` prop 中调用后端捕获支付。

### Day 46-47: COD 货到付款
- **任务**: 实现 COD 支付选项。
- **后端 (Spring Boot)**:
    - **`OrderService.createOrder` 逻辑**:
        - 当 `paymentMethod` 为 `COD` 时，直接将订单状态设为 `PAID` (或 `WAITING_FOR_SHIPMENT`)，跳过支付流程。
        - 计算并添加 COD 手续费。
- **前端 (Next.js)**:
    - 在 `PaymentMethodSelector.tsx` 中添加 "Cash on Delivery" 选项。
    - 当用户选择 COD 时，下单后直接跳转到订单确认页。

### Day 48-50: 邮件通知
- **任务**: 实现关键业务节点的邮件通知。
- **后端 (Spring Boot)**:
    - **依赖**: `spring-boot-starter-mail`
    - **配置 (`application.yml`)**:
        - 配置 SMTP 服务器信息。
    - **Service (`com.ecommerce.service.EmailService.java`)**:
        - `sendOrderConfirmationEmail(User user, Order order)`: 发送订单确认邮件。
        - `sendShippingNotificationEmail(User user, Order order)`: 发送发货通知邮件。
    - **模板 (Thymeleaf/Freemarker)**:
        - 创建 `order-confirmation.html`, `shipping-notification.html` 等邮件模板。
    - **集成**:
        - 在 `OrderService` 的 `createOrder` 和 `shipOrder` 方法中异步调用 `EmailService`。

---

## Week 11-12: 数据分析、测试、优化与部署

**目标**: 完成数据报表功能，进行全面的 E2E 测试和性能优化，最终将 MVP 版本部署到生产环境。

### Day 51-53: 销售报表与数据分析
- **任务**: 为卖家提供基础的销售数据报表。
- **后端 (Spring Boot)**:
    - **Repository (`OrderRepository.java`)**:
        - 添加 JPQL 查询方法，用于统计 GMV、订单数、AOV 等。
    - **Service (`com.ecommerce.service.AnalyticsService.java`)**:
        - `getDashboardData(DateRange range)`: 获取指定时间范围内的核心指标。
        - `getTopSellingProducts(DateRange range, int limit)`: 获取畅销商品排行。
    - **Controller (`com.ecommerce.controller.admin.AnalyticsController.java`)**:
        - `GET /api/v1/admin/analytics/dashboard`: 提供报表数据。
- **前端 (Next.js)**:
    - **依赖**: `npm install chart.js react-chartjs-2`
    - **页面 (`/app/admin/dashboard/page.tsx`)**:
        - 开发管理后台的 Dashboard 页面。
    - **组件 (`/components/admin/dashboard`)**:
        - `StatsCard.tsx`: 用于显示单个核心指标（如 GMV）的卡片。
        - `SalesChart.tsx`: 用于展示销售趋势的折线图。
        - `TopProductsTable.tsx`: 展示畅销商品列表。

### Day 54: Google Analytics 集成
- **任务**: 集成 GA4 以追踪用户行为。
- **前端 (Next.js)**:
    - **`lib/gtag.js`**: 创建 GA 工具函数 (`pageview`, `event`)。
    - **`app/layout.tsx`**: 在根布局中引入 GA 脚本。
    - **组件/页面**:
        - 在关键用户行为处（如 `AddToCartButton`, `CheckoutForm`）调用 `gtag.event` 来发送电子商务事件。

### Day 55-57: 全流程 E2E 测试
- **任务**: 使用 Playwright 编写并执行端到端测试，覆盖核心用户路径。
- **测试 (Playwright)**:
    - **测试用例**:
        - `auth.spec.ts`: 注册、登录、退出。
        - `shopping.spec.ts`: 浏览商品 -> 查看详情 -> 加入购物车。
        - `checkout.spec.ts`: 购物车 -> 填写地址 -> 选择支付方式 -> 下单成功。
        - `admin.spec.ts`: 登录后台 -> 创建商品 -> AI生成内容 -> 编辑商品 -> 查看订单。

### Day 58-59: 性能优化
- **任务**: 识别并解决性能瓶颈。
- **前端 (Next.js)**:
    - 使用 `next/image` 优化图片加载。
    - 使用 Lighthouse 分析页面性能，并根据建议进行优化（如减少 LCP）。
    - 代码分割：使用 `next/dynamic` 动态加载非首屏组件。
- **后端 (Spring Boot)**:
    - 检查并优化慢查询（使用 `EXPLAIN ANALYZE`）。
    - 为常用查询添加数据库索引。
    - 配置 Redis 缓存（如缓存商品详情、分类列表）。

### Day 60-61: 安全审计
- **任务**: 检查并加固应用安全。
- **后端 (Spring Boot)**:
    - 检查所有 API 端点，确保权限设置正确 (`@PreAuthorize`)。
    - 确认所有用户输入都经过了验证和清理，防止 XSS 和 SQL 注入。
    - 启用 CSRF 保护。
- **前端 (Next.js)**:
    - 设置严格的 Content Security Policy (CSP)。

### Day 62-64: 生产环境部署
- **任务**: 将应用部署到云服务器。
- **DevOps**:
    - **CI/CD (GitHub Actions)**:
        - 创建 `.github/workflows/deploy.yml`。
        - 编写构建 Docker 镜像、推送到容器镜像服务 (如 Aliyun ACR)、SSH 到服务器并重启服务的脚本。
    - **服务器配置**:
        - 在云服务器上安装 Docker 和 Docker Compose。
        - 配置 Nginx 作为反向代理，处理 HTTPS 和负载均衡。
        - 配置生产环境的环境变量。
    - **上线**:
        - 运行部署流水线。
        - 执行生产数据库迁移 (Flyway)。
        - 最终线上测试，确认功能正常。
