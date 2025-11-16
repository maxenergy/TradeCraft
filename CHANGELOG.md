# 更新日志

本文档记录TradeCraft项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 计划功能
- 社交媒体登录（微信、Google、Facebook）
- 产品推荐系统（AI驱动）
- 多仓库管理
- 物流追踪集成
- 高级分析仪表板
- 移动应用（React Native）

## [0.1.0] - 2024-12-31 (目标发布日期)

### 新增
- **核心功能**
  - 用户注册和登录（JWT认证）
  - 产品目录浏览（多语言：中文、英文、印尼语）
  - 购物车管理
  - 订单创建和跟踪
  - 支付集成（Stripe、PayPal、货到付款）

- **管理功能**
  - 产品管理CRUD
  - 分类管理
  - 订单管理
  - 用户管理

- **AI功能**
  - 产品描述生成（文心一言、GLM-4）
  - 自动翻译（Azure Translator）
  - 内容优化

- **基础设施**
  - Docker容器化部署
  - PostgreSQL数据库
  - Redis缓存
  - Nginx反向代理
  - CI/CD流水线（GitHub Actions）

### 技术栈
- **后端**: Spring Boot 3.2.0, Java 17
- **前端**: Next.js 14, React 18, TypeScript
- **AI服务**: FastAPI 0.109, Python 3.11
- **数据库**: PostgreSQL 15
- **缓存**: Redis 7.2

### 数据库
- 初始表结构（14张表）
- Flyway迁移脚本
- 测试数据种子

### 文档
- 开发计划（Week 1-12）
- 快速开始指南
- 技术栈文档
- API文档（Swagger）
- 故障排查指南
- 安全最佳实践

---

## 版本历史

### [0.0.1] - 2024-11-16

#### 新增
- 项目初始化
- 基础项目结构
- 开发文档框架
- CI/CD配置

---

## 版本命名规范

### 主版本号 (Major)
- 不兼容的API更改
- 架构重大变更
- 破坏性更新

**示例**: 1.0.0 → 2.0.0

### 次版本号 (Minor)
- 向后兼容的新功能
- 重要功能增强
- 依赖项主要更新

**示例**: 1.0.0 → 1.1.0

### 修订号 (Patch)
- 向后兼容的bug修复
- 性能优化
- 文档更新
- 安全补丁

**示例**: 1.0.0 → 1.0.1

---

## 更新类型说明

### 新增 (Added)
新功能或特性。

```markdown
- 用户可以通过邮箱重置密码
- 支持产品批量导入
- 新增订单导出功能
```

### 变更 (Changed)
现有功能的改变。

```markdown
- 更改产品列表分页默认大小从10到20
- 优化图片上传性能
- 更新用户界面设计
```

### 废弃 (Deprecated)
即将移除的功能。

```markdown
- `/api/v1/old-endpoint` 将在v2.0.0中移除，请使用 `/api/v2/new-endpoint`
```

### 移除 (Removed)
已移除的功能。

```markdown
- 移除旧版登录API
- 删除不再使用的产品标签功能
```

### 修复 (Fixed)
Bug修复。

```markdown
- 修复购物车数量更新不正确的问题
- 解决支付回调超时问题
- 修复产品搜索中文分词错误
```

### 安全 (Security)
安全相关的更新。

```markdown
- 修复JWT令牌验证漏洞 (CVE-2024-XXXX)
- 升级依赖以解决安全警告
- 加强密码策略
```

---

## 发布流程

1. **准备发布**
   ```bash
   # 确保所有测试通过
   npm test
   ./mvnw test
   pytest

   # 更新版本号
   # 更新 CHANGELOG.md
   ```

2. **创建发布分支**
   ```bash
   git checkout -b release/v0.1.0
   git push origin release/v0.1.0
   ```

3. **创建标签**
   ```bash
   git tag -a v0.1.0 -m "Release v0.1.0"
   git push origin v0.1.0
   ```

4. **部署**
   ```bash
   ./scripts/deployment/deploy.sh
   ```

5. **发布公告**
   - 更新 GitHub Release
   - 通知团队和用户
   - 更新文档网站

---

## 迁移指南

### 从 0.0.x 到 0.1.0

#### 数据库迁移
```bash
# 备份数据库
./scripts/database/backup.sh

# 运行迁移
cd backend
./mvnw flyway:migrate
```

#### API变更
- 所有API端点现在需要认证
- 添加 `Authorization: Bearer <token>` 头

#### 配置变更
- 新增必需环境变量：
  ```
  JWT_SECRET=<生成的密钥>
  STRIPE_SECRET_KEY=<你的密钥>
  ```

---

## 贡献

请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何为项目贡献代码。

提交变更时，请遵循以下提交信息格式：

```
类型(范围): 简短描述

详细描述（可选）

相关Issue: #123
```

**类型**:
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `chore`: 构建/工具更改

**示例**:
```
feat(auth): add password reset functionality

Implement password reset via email with secure token.
Users can now request password reset and receive an email
with a time-limited reset link.

Closes: #42
```

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件
