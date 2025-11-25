# 🚀 TradeCraft 快速开始指南

欢迎使用TradeCraft跨境电商平台！本指南将帮助您在5分钟内启动并运行整个系统。

---

## 📋 前置要求

确保您的系统已安装：
- ✅ **Java 17** 或更高版本
- ✅ **Node.js 18** 或更高版本
- ✅ **PostgreSQL 15** 或更高版本
- ✅ **Maven 3.8+** (或使用项目自带的mvnw)
- ✅ **Git**

---

## 🎯 快速启动（3步）

### 步骤 1: 克隆并配置环境

```bash
# 克隆项目
git clone https://github.com/yourusername/TradeCraft.git
cd TradeCraft

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
nano .env
```

**最小配置示例：**
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tradecraft_dev
DB_USERNAME=tradecraft
DB_PASSWORD=tradecraft123

# JWT密钥（生产环境请修改）
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=86400000

# API基础URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 步骤 2: 创建数据库

```bash
# 登录PostgreSQL
psql -U postgres

# 创建数据库和用户
CREATE DATABASE tradecraft_dev;
CREATE USER tradecraft WITH PASSWORD 'tradecraft123';
GRANT ALL PRIVILEGES ON DATABASE tradecraft_dev TO tradecraft;
\q
```

### 步骤 3: 加载测试数据

```bash
# 进入数据库脚本目录
cd scripts/database

# 运行测试数据加载脚本
./load-test-data.sh

# 或者手动执行SQL
psql -h localhost -p 5432 -U tradecraft -d tradecraft_dev -f seed-test-data.sql
```

---

## 🏃 启动服务

### 方式一：使用终端（推荐开发）

**终端 1 - 启动后端：**
```bash
cd backend
./mvnw spring-boot:run

# 或使用Maven
mvn spring-boot:run
```

**终端 2 - 启动前端：**
```bash
cd frontend
npm install
npm run dev
```

**终端 3 - 启动AI服务（可选）：**
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

### 方式二：使用Docker Compose

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 🌐 访问应用

服务启动后，您可以访问：

| 服务 | URL | 说明 |
|------|-----|------|
| 🎨 **前端应用** | http://localhost:3000 | 用户界面 |
| 🔧 **后端API** | http://localhost:8080 | REST API |
| 📚 **API文档** | http://localhost:8080/swagger-ui.html | Swagger文档 |
| 🤖 **AI服务** | http://localhost:8000/docs | FastAPI文档 |

---

## 👤 测试账户

测试数据脚本已创建以下账户：

### 买家账户
```
邮箱: buyer1@test.com
密码: Test123!
角色: 普通用户
```

```
邮箱: buyer2@test.com
密码: Test123!
角色: 普通用户
```

### 管理员账户
```
邮箱: seller@test.com
密码: Test123!
角色: 管理员
```

---

## 🛍️ 测试数据概览

加载的测试数据包括：

### 📦 产品类别
- ✅ 电子产品（智能手机、笔记本电脑、音频设备）
- ✅ 时尚服饰（男装、女装、鞋类）
- ✅ 家居生活
- ✅ 美妆护肤
- ✅ 运动户外

### 🛒 产品列表（10个示例产品）
1. **旗舰智能手机 5G** - ¥4,999 / $699
2. **经济实惠智能手机** - ¥1,299 / $179
3. **轻薄商务笔记本** - ¥6,999 / $999
4. **无线降噪耳机** - ¥1,899 / $269
5. **男士商务衬衫** - ¥299 / $42
6. **女士优雅连衣裙** - ¥459 / $65
7. **运动休闲鞋** - ¥399 / $56
8. **智能台灯** - ¥259 / $36
9. **保湿护肤套装** - ¥599 / $85
10. **瑜伽垫套装** - ¥189 / $27

所有产品都包含：
- ✅ 中文、英文、印尼语三语言支持
- ✅ 四种货币定价（CNY/USD/IDR/MYR）
- ✅ 高质量产品图片（Unsplash）
- ✅ 完整的SEO元数据

---

## 🧪 测试完整用户流程

### 1. 注册新账户
1. 访问 http://localhost:3000/register
2. 填写注册信息
3. 使用注册的账户登录

### 2. 浏览产品
1. 访问首页查看特色产品
2. 点击"产品"菜单浏览所有产品
3. 使用搜索和过滤功能

### 3. 加入购物车
1. 点击任意产品查看详情
2. 选择数量
3. 点击"加入购物车"

### 4. 结账下单
1. 点击购物车图标
2. 查看购物车内容
3. 点击"去结账"
4. 填写收货地址
5. 选择支付方式
6. 提交订单

### 5. 查看订单
1. 登录后访问"我的订单"
2. 查看订单列表和详情
3. 追踪订单状态

---

## 🔧 常见问题

### Q1: 后端启动失败，显示"无法连接数据库"
**A:** 检查以下内容：
- PostgreSQL服务是否运行
- `.env` 文件中的数据库配置是否正确
- 数据库 `tradecraft_dev` 是否已创建
- 用户 `tradecraft` 是否有权限

```bash
# 检查PostgreSQL状态
sudo systemctl status postgresql

# 重启PostgreSQL
sudo systemctl restart postgresql
```

### Q2: 前端无法连接后端API
**A:** 确认：
- 后端服务运行在 http://localhost:8080
- `.env.local` 中的 `NEXT_PUBLIC_API_URL` 正确设置
- 浏览器控制台是否有CORS错误

### Q3: 测试数据加载失败
**A:** 常见原因：
- 数据库用户权限不足
- 已存在的数据导致外键冲突
- SQL语法与PostgreSQL版本不兼容

**解决方案：**
```bash
# 完全重置数据库
dropdb -U postgres tradecraft_dev
createdb -U postgres tradecraft_dev
psql -U postgres -d tradecraft_dev -c "GRANT ALL PRIVILEGES ON DATABASE tradecraft_dev TO tradecraft;"

# 重新加载数据
cd scripts/database
./load-test-data.sh
```

### Q4: JWT认证失败
**A:** 检查：
- JWT_SECRET 环境变量是否设置
- token是否过期
- 浏览器localStorage中的token是否存在

清除并重新登录：
```javascript
// 浏览器控制台执行
localStorage.clear();
// 然后重新登录
```

### Q5: 图片无法显示
**A:** 测试数据使用Unsplash图片，需要：
- 互联网连接
- 浏览器允许加载外部图片
- 检查浏览器控制台的网络错误

---

## 📊 API端点快速参考

### 认证相关
```http
POST   /api/v1/auth/register          # 注册
POST   /api/v1/auth/login             # 登录
POST   /api/v1/auth/refresh           # 刷新token
GET    /api/v1/auth/check-email       # 检查邮箱
```

### 产品相关
```http
GET    /api/v1/products               # 获取产品列表
GET    /api/v1/products/{id}          # 获取产品详情
GET    /api/v1/products/featured      # 获取特色产品
GET    /api/v1/products/search        # 搜索产品
GET    /api/v1/products/category/{id} # 按分类查询
```

### 购物车相关
```http
GET    /api/v1/cart                   # 获取购物车
POST   /api/v1/cart/items             # 添加商品
PUT    /api/v1/cart/items/{id}        # 更新数量
DELETE /api/v1/cart/items/{id}        # 删除商品
DELETE /api/v1/cart                   # 清空购物车
```

### 订单相关
```http
GET    /api/v1/orders                 # 获取订单列表
GET    /api/v1/orders/{id}            # 获取订单详情
POST   /api/v1/orders                 # 创建订单
POST   /api/v1/orders/{id}/cancel     # 取消订单
```

### 用户相关
```http
GET    /api/v1/users/me               # 获取当前用户
PUT    /api/v1/users/me               # 更新用户信息
POST   /api/v1/users/me/change-password # 修改密码
```

完整API文档: http://localhost:8080/swagger-ui.html

---

## 🎨 项目结构

```
TradeCraft/
├── backend/               # Spring Boot后端
│   ├── src/
│   │   ├── main/java/com/tradecraft/
│   │   │   ├── controller/    # REST控制器
│   │   │   ├── service/       # 业务逻辑
│   │   │   ├── repository/    # 数据访问
│   │   │   ├── entity/        # 数据模型
│   │   │   └── security/      # 安全配置
│   │   └── resources/
│   │       └── db/migration/  # Flyway迁移脚本
│   └── pom.xml
│
├── frontend/              # Next.js前端
│   ├── src/
│   │   ├── app/          # 页面路由
│   │   ├── components/   # React组件
│   │   ├── lib/          # API客户端
│   │   └── types/        # TypeScript类型
│   └── package.json
│
├── ai-service/           # FastAPI AI服务
│   ├── main.py
│   ├── config.py
│   └── requirements.txt
│
├── scripts/              # 实用脚本
│   ├── database/        # 数据库相关
│   ├── deployment/      # 部署脚本
│   └── dev/            # 开发工具
│
└── docker-compose.yml   # Docker配置
```

---

## 📚 下一步

现在您已经成功启动了TradeCraft，可以：

1. **📖 阅读完整文档**
   - [开发计划](DEVELOPMENT_PLAN_README.md)
   - [技术栈详解](TECH_STACK.md)
   - [API文档](http://localhost:8080/swagger-ui.html)

2. **🔨 开始开发**
   - 添加新功能
   - 集成支付网关
   - 实现AI内容生成

3. **🚀 部署到生产**
   - 参考[部署指南](DEPLOYMENT.md)
   - 配置SSL证书
   - 设置CI/CD

---

## 💡 获取帮助

遇到问题？
- 📖 查看 [FAQ.md](FAQ.md)
- 🐛 查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 💬 提交 [GitHub Issue](https://github.com/yourusername/TradeCraft/issues)

---

**祝您开发愉快！** 🎉
