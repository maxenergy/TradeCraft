# TradeCraft 快速开始指南

**5分钟快速启动开发环境**

---

## 📋 前置要求

确保你的开发环境已安装以下工具：

- **Docker Desktop** (>= 20.10)
- **Docker Compose** (>= 2.0)
- **Git** (>= 2.30)
- **Node.js** (>= 18.17)
- **Java** (>= 17)
- **Maven** (>= 3.8)
- **Python** (>= 3.11)

---

## 🚀 快速启动（开发环境）

### Step 1: 克隆项目

```bash
git clone https://github.com/yourusername/TradeCraft.git
cd TradeCraft
```

### Step 2: 配置环境变量

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入必要的配置：

```bash
# 数据库
DB_USERNAME=tradecraft
DB_PASSWORD=your_secure_password

# Redis
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_jwt_secret_key_min_32_chars

# 阿里云OSS
ALIYUN_OSS_ACCESS_KEY=your_access_key
ALIYUN_OSS_SECRET_KEY=your_secret_key
ALIYUN_OSS_BUCKET=tradecraft-images
ALIYUN_OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com

# AI服务
WENXIN_API_KEY=your_wenxin_api_key
WENXIN_SECRET_KEY=your_wenxin_secret_key
GLM_API_KEY=your_glm_api_key
AZURE_TRANSLATOR_KEY=your_azure_translator_key
AZURE_TRANSLATOR_REGION=eastasia

# 支付
STRIPE_API_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Google Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: 启动Docker开发环境

```bash
# 启动PostgreSQL和Redis
docker-compose up -d db redis

# 等待数据库启动（约10秒）
sleep 10

# 查看容器状态
docker-compose ps
```

### Step 4: 初始化数据库

```bash
cd backend

# 运行Flyway迁移
./mvnw flyway:migrate

# 或者启动Spring Boot应用（自动运行迁移）
./mvnw spring-boot:run
```

### Step 5: 启动后端服务

**方式1：使用Maven**
```bash
cd backend
./mvnw spring-boot:run
```

**方式2：使用Docker**
```bash
docker-compose up -d backend
```

后端服务将在 `http://localhost:8080` 启动

API文档（Swagger）: `http://localhost:8080/swagger-ui.html`

### Step 6: 启动前端服务

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端应用将在 `http://localhost:3000` 启动

### Step 7: 启动AI服务

```bash
cd ai-service

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动FastAPI
uvicorn main:app --reload --port 8000
```

AI服务将在 `http://localhost:8000` 启动

API文档: `http://localhost:8000/docs`

---

## ✅ 验证安装

### 1. 检查后端健康状态

```bash
curl http://localhost:8080/api/v1/health
```

预期输出：
```json
{
  "status": "UP",
  "timestamp": "2025-11-16T10:00:00Z"
}
```

### 2. 检查前端

浏览器访问 `http://localhost:3000`，应该看到首页。

### 3. 检查AI服务

```bash
curl http://localhost:8000/health
```

预期输出：
```json
{
  "status": "healthy",
  "services": {
    "wenxin": "available",
    "glm": "available",
    "translator": "available"
  }
}
```

---

## 🎯 第一个API调用

### 1. 创建管理员账号

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tradecraft.com",
    "password": "Admin123456",
    "confirmPassword": "Admin123456",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### 2. 登录获取Token

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tradecraft.com",
    "password": "Admin123456"
  }'
```

保存返回的 `token`。

### 3. 创建商品分类

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:8080/api/v1/admin/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nameZhCn": "电子产品",
    "nameEn": "Electronics",
    "nameId": "Elektronik",
    "slug": "electronics",
    "description": "电子产品类别"
  }'
```

### 4. 创建商品

```bash
curl -X POST http://localhost:8080/api/v1/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "nameZhCn": "无线蓝牙耳机",
    "nameEn": "Wireless Bluetooth Headphones",
    "nameId": "Headphone Bluetooth Nirkabel",
    "priceCny": 299.00,
    "stock": 100,
    "weight": 0.2,
    "status": "PUBLISHED"
  }'
```

### 5. 使用AI生成商品描述

```bash
curl -X POST http://localhost:8000/api/v1/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "无线蓝牙耳机",
    "category": "电子产品",
    "features": ["降噪", "续航30小时", "快充"],
    "targetLanguages": ["zh-CN", "en", "id"]
  }'
```

---

## 📂 项目结构速览

```
TradeCraft/
├── backend/                    # Spring Boot后端
│   ├── src/main/java/
│   │   └── com/tradecraft/ecommerce/
│   │       ├── controller/    # REST控制器
│   │       ├── service/       # 业务逻辑
│   │       ├── repository/    # 数据访问层
│   │       ├── entity/        # JPA实体
│   │       ├── dto/           # 数据传输对象
│   │       ├── config/        # 配置类
│   │       └── security/      # 安全配置
│   └── src/main/resources/
│       ├── application.yml    # 应用配置
│       └── db/migration/      # Flyway迁移脚本
│
├── frontend/                   # Next.js前端
│   ├── app/                   # App Router页面
│   │   ├── [locale]/          # 国际化路由
│   │   ├── admin/             # 管理后台
│   │   └── api/               # API路由
│   ├── components/            # React组件
│   │   ├── ui/                # UI基础组件
│   │   ├── layout/            # 布局组件
│   │   ├── product/           # 商品组件
│   │   └── admin/             # 管理组件
│   ├── lib/                   # 工具函数
│   │   ├── api/               # API客户端
│   │   └── utils/             # 工具函数
│   ├── store/                 # Zustand状态管理
│   └── types/                 # TypeScript类型
│
├── ai-service/                 # FastAPI AI服务
│   ├── main.py                # FastAPI主应用
│   ├── routers/               # API路由
│   ├── services/              # AI服务
│   │   ├── content_generator.py
│   │   ├── wenxin_client.py
│   │   └── translator.py
│   └── models/                # 数据模型
│
├── nginx/                      # Nginx配置
├── scripts/                    # 部署脚本
└── docker-compose.yml         # Docker编排
```

---

## 🧪 运行测试

### 后端测试

```bash
cd backend

# 运行所有测试
./mvnw test

# 运行特定测试类
./mvnw test -Dtest=ProductServiceTest

# 生成测试覆盖率报告
./mvnw jacoco:report
# 报告位置: target/site/jacoco/index.html
```

### 前端测试

```bash
cd frontend

# 运行单元测试
npm test

# 运行E2E测试
npm run test:e2e

# 生成覆盖率报告
npm run test:coverage
```

### AI服务测试

```bash
cd ai-service

# 运行pytest
pytest

# 生成覆盖率报告
pytest --cov=. --cov-report=html
```

---

## 🐛 常见问题

### 问题1: 数据库连接失败

**错误**：`Connection refused: connect`

**解决方案**：
```bash
# 检查PostgreSQL是否运行
docker-compose ps db

# 重启数据库
docker-compose restart db

# 查看数据库日志
docker-compose logs db
```

### 问题2: Redis连接失败

**解决方案**：
```bash
# 检查Redis是否运行
docker-compose ps redis

# 测试Redis连接
docker exec -it tradecraft-redis redis-cli ping
# 应该返回: PONG
```

### 问题3: 端口冲突

**错误**：`Port 8080 is already in use`

**解决方案**：
```bash
# 查找占用端口的进程
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# 修改docker-compose.yml中的端口映射
ports:
  - "8081:8080"  # 使用8081代替8080
```

### 问题4: Node模块安装失败

**解决方案**：
```bash
cd frontend

# 清除缓存
npm cache clean --force

# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题5: Flyway迁移失败

**解决方案**：
```bash
# 重置数据库
docker-compose down -v
docker-compose up -d db
sleep 10

# 重新运行迁移
cd backend
./mvnw flyway:migrate
```

---

## 📝 开发工作流

### 日常开发流程

1. **启动开发环境**
   ```bash
   docker-compose up -d db redis
   ```

2. **启动后端（终端1）**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. **启动前端（终端2）**
   ```bash
   cd frontend
   npm run dev
   ```

4. **启动AI服务（终端3）**
   ```bash
   cd ai-service
   source venv/bin/activate
   uvicorn main:app --reload
   ```

5. **开发和测试**
   - 修改代码
   - 保存后自动热重载
   - 访问 `http://localhost:3000` 查看更改

6. **提交代码前**
   ```bash
   # 运行所有测试
   cd backend && ./mvnw test && cd ..
   cd frontend && npm test && cd ..
   cd ai-service && pytest && cd ..

   # 格式化代码
   cd frontend && npm run lint:fix && cd ..

   # 提交
   git add .
   git commit -m "feat: your feature description"
   git push
   ```

---

## 🔧 开发工具推荐

### IDE配置

**后端（IntelliJ IDEA）**
- 安装插件：Lombok, Spring Boot
- 配置：Settings → Build → Compiler → Annotation Processors → Enable

**前端（VS Code）**
推荐插件：
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "christian-kohler.path-intellisense"
  ]
}
```

**Python（PyCharm / VS Code）**
- PyCharm: 配置Python解释器到venv
- VS Code: 安装Python、Pylance插件

### 浏览器扩展

- **React Developer Tools** - React组件调试
- **Redux DevTools** - 状态管理调试（虽然我们用Zustand）
- **JSON Formatter** - 格式化API响应
- **Postman** / **Insomnia** - API测试

---

## 📚 下一步

现在开发环境已经就绪，你可以：

1. **阅读详细开发计划**
   - 从 `DEVELOPMENT_PLAN_README.md` 开始
   - 按照12周计划逐步实现

2. **实现第一个功能**
   - 参考 `DEVELOPMENT_PLAN.md` Day 1-2
   - 完成项目结构搭建

3. **学习代码示例**
   - 查看 `DEVELOPMENT_PLAN_PART2.md` 中的商品CRUD实现
   - 理解分层架构模式

4. **加入开发**
   - 创建功能分支：`git checkout -b feature/your-feature`
   - 按照TDD实现功能
   - 提交PR

---

## 🆘 获取帮助

- **文档问题**：查看 `DEVELOPMENT_PLAN_README.md`
- **技术问题**：查看 `tdd.md` 技术设计文档
- **业务问题**：查看 `prd.md` 产品需求文档
- **部署问题**：查看 `DEVELOPMENT_PLAN_PART5.md` 部署章节

---

**祝开发顺利！🚀**

如果遇到问题，请查看详细文档或创建Issue。
