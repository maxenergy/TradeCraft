# 贡献指南

感谢你对TradeCraft项目的关注！我们欢迎任何形式的贡献，包括但不限于：

- 🐛 报告Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ✨ 开发新功能

---

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request流程](#pull-request流程)
- [测试要求](#测试要求)

---

## 📜 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们作为贡献者和维护者承诺：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化的语言或图像
- 侮辱性/贬损性评论，人身攻击
- 公开或私下骚扰
- 未经明确许可发布他人的私人信息
- 其他在专业环境中被认为不适当的行为

---

## 🤝 如何贡献

### 报告Bug

在创建Bug报告之前，请：

1. **搜索现有Issues** - 确保问题尚未被报告
2. **使用最新版本** - 确认问题在最新版本中仍然存在
3. **准备详细信息** - 收集复现问题所需的所有信息

**创建Bug报告时，请包含：**

```markdown
## Bug描述
简洁清晰地描述Bug

## 复现步骤
1. 执行 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

## 期望行为
描述你期望发生的事情

## 实际行为
描述实际发生的事情

## 截图
如果适用，添加截图帮助解释问题

## 环境信息
- OS: [例如 macOS 14.0]
- Browser: [例如 Chrome 120]
- Node版本: [例如 18.17.0]
- Java版本: [例如 17.0.8]

## 附加信息
任何其他有助于解决问题的信息
```

### 提出功能建议

**创建功能请求时，请包含：**

```markdown
## 功能描述
清晰简洁地描述你想要的功能

## 问题背景
描述这个功能解决什么问题

## 建议的解决方案
描述你期望如何实现这个功能

## 替代方案
描述你考虑过的任何替代解决方案

## 附加信息
任何其他有关功能请求的信息、截图等
```

---

## 🔧 开发流程

### 1. Fork项目

点击GitHub页面右上角的"Fork"按钮

### 2. 克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/TradeCraft.git
cd TradeCraft
```

### 3. 添加上游仓库

```bash
git remote add upstream https://github.com/original/TradeCraft.git
```

### 4. 创建分支

```bash
# 确保main分支是最新的
git checkout main
git pull upstream main

# 创建功能分支
git checkout -b feature/your-feature-name
# 或修复分支
git checkout -b bugfix/issue-number
```

### 5. 设置开发环境

参考 [QUICKSTART.md](QUICKSTART.md) 设置本地开发环境。

### 6. 进行更改

编写代码，确保遵循[代码规范](#代码规范)。

### 7. 测试更改

```bash
# 后端测试
cd backend
./mvnw test

# 前端测试
cd frontend
npm test

# AI服务测试
cd ai-service
pytest
```

### 8. 提交更改

参考[提交规范](#提交规范)编写提交信息。

```bash
git add .
git commit -m "feat: add amazing feature"
```

### 9. 推送到Fork

```bash
git push origin feature/your-feature-name
```

### 10. 创建Pull Request

在GitHub上创建Pull Request，详见[Pull Request流程](#pull-request流程)。

---

## 📏 代码规范

### 后端（Java/Spring Boot）

遵循[Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)

**关键点：**

```java
// 1. 类名使用大驼峰（PascalCase）
public class ProductService { }

// 2. 方法名和变量使用小驼峰（camelCase）
public Product getProductById(Long productId) { }

// 3. 常量使用全大写下划线分隔
public static final int MAX_RETRY_COUNT = 3;

// 4. 使用有意义的命名
// 好的示例
public List<Product> getActiveProducts() { }

// 不好的示例
public List<Product> get() { }
public List<Product> getData() { }

// 5. 添加JavaDoc注释（公共API）
/**
 * 根据ID获取商品
 *
 * @param productId 商品ID
 * @return 商品信息
 * @throws ResourceNotFoundException 商品不存在时抛出
 */
public Product getProductById(Long productId) { }

// 6. 使用Lombok减少样板代码
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    private Long id;
    private String name;
}

// 7. Service层方法添加事务注解
@Transactional(readOnly = true)
public List<Product> getAllProducts() { }

@Transactional
public Product createProduct(CreateProductRequest request) { }
```

### 前端（TypeScript/React/Next.js）

遵循[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

**关键点：**

```typescript
// 1. 组件名使用大驼峰
export function ProductCard() { }

// 2. 文件名使用kebab-case（小写短横线）
// product-card.tsx
// use-cart-store.ts

// 3. 接口和类型使用大驼峰
interface Product {
  id: number;
  name: string;
}

type ProductResponse = {
  data: Product[];
  total: number;
};

// 4. 使用函数组件和Hooks
export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return <div>...</div>;
}

// 5. Props解构
interface ProductCardProps {
  product: Product;
  onSelect: (id: number) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return <div onClick={() => onSelect(product.id)}>...</div>;
}

// 6. 使用ESLint和Prettier
// 运行: npm run lint
// 运行: npm run format

// 7. 导入顺序
// a. React和Next.js
import { useState } from 'react';
import Link from 'next/link';

// b. 第三方库
import { format } from 'date-fns';

// c. 项目内部导入
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';

// d. 样式
import styles from './product.module.css';
```

### AI服务（Python/FastAPI）

遵循[PEP 8](https://peps.python.org/pep-0008/)

**关键点：**

```python
# 1. 类名使用大驼峰
class ContentGenerator:
    pass

# 2. 函数和变量使用小写下划线
def generate_product_description(product_name: str) -> str:
    pass

# 3. 常量使用全大写
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30

# 4. 类型提示
def get_product(product_id: int) -> dict[str, any]:
    return {"id": product_id, "name": "Product"}

# 5. 文档字符串
def translate_text(text: str, target_lang: str) -> str:
    """
    翻译文本到目标语言

    Args:
        text: 要翻译的文本
        target_lang: 目标语言代码（如 'en', 'id'）

    Returns:
        翻译后的文本

    Raises:
        TranslationError: 翻译失败时抛出
    """
    pass

# 6. 异步函数
async def fetch_data(url: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

# 7. 使用Black格式化代码
# 运行: black .
```

---

## 💬 提交规范

使用[Conventional Commits](https://www.conventionalcommits.org/)规范：

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

- **feat**: 新功能
- **fix**: Bug修复
- **docs**: 文档更新
- **style**: 代码格式（不影响代码运行）
- **refactor**: 重构（既不是新功能也不是Bug修复）
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动
- **ci**: CI配置文件和脚本的变动
- **revert**: 回滚之前的提交

### Scope范围（可选）

- **backend**: 后端相关
- **frontend**: 前端相关
- **ai**: AI服务相关
- **docs**: 文档
- **deps**: 依赖更新

### 示例

```bash
# 新功能
git commit -m "feat(backend): add product search API"

# Bug修复
git commit -m "fix(frontend): fix cart total calculation"

# 文档更新
git commit -m "docs: update README with deployment instructions"

# 重构
git commit -m "refactor(ai): improve content generation logic"

# 性能优化
git commit -m "perf(backend): add database query caching"

# 多行提交
git commit -m "feat(backend): add user authentication

- Implement JWT token generation
- Add login and registration endpoints
- Add password encryption with BCrypt

Closes #123"
```

---

## 🔀 Pull Request流程

### 1. 确保PR准备就绪

- ✅ 代码遵循项目规范
- ✅ 所有测试通过
- ✅ 没有合并冲突
- ✅ 提交信息清晰
- ✅ 更新了相关文档

### 2. 创建Pull Request

**PR标题示例：**
```
feat(backend): Add product recommendation API
fix(frontend): Fix cart quantity update bug
docs: Add API documentation for payment endpoints
```

**PR描述模板：**

```markdown
## 📝 变更说明
<!-- 描述这个PR的目的和内容 -->

## 🔗 相关Issue
<!-- 关联的Issue编号 -->
Closes #123
Relates to #456

## 🧪 测试
<!-- 如何测试这些变更 -->
- [ ] 单元测试
- [ ] 集成测试
- [ ] 手动测试

## 📸 截图（如适用）
<!-- 添加UI变更的截图 -->

## ✅ 检查清单
- [ ] 代码遵循项目规范
- [ ] 自测所有变更
- [ ] 更新了相关文档
- [ ] 添加了必要的测试
- [ ] 所有测试通过
- [ ] 没有引入新的警告
```

### 3. Code Review

- 至少需要1个审核者批准
- 积极响应审核意见
- 及时更新代码

### 4. 合并

PR被批准后，维护者会合并到主分支。

---

## 🧪 测试要求

### 后端测试

```bash
# 运行所有测试
./mvnw test

# 运行特定测试类
./mvnw test -Dtest=ProductServiceTest

# 生成覆盖率报告
./mvnw jacoco:report
```

**最低覆盖率要求：60%**

### 前端测试

```bash
# 运行单元测试
npm test

# 运行E2E测试
npm run test:e2e

# 生成覆盖率报告
npm run test:coverage
```

**最低覆盖率要求：50%**

### AI服务测试

```bash
# 运行测试
pytest

# 生成覆盖率报告
pytest --cov=. --cov-report=html
```

**最低覆盖率要求：40%**

---

## 📚 其他资源

- [项目README](README.md)
- [快速开始指南](QUICKSTART.md)
- [技术栈详解](TECH_STACK.md)
- [常见问题FAQ](FAQ.md)
- [开发计划](DEVELOPMENT_PLAN_README.md)

---

## ❓ 问题和支持

- **技术问题**：在GitHub Issues中提问
- **功能讨论**：在GitHub Discussions中讨论
- **安全漏洞**：请发送邮件至 security@tradecraft.com

---

## 📄 许可证

通过贡献代码，你同意你的贡献将在与项目相同的[MIT许可证](LICENSE)下授权。

---

**感谢你的贡献！** 🎉

每一个贡献，无论大小，都让TradeCraft变得更好！
