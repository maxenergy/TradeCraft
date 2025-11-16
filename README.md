# 🚀 TradeCraft - 跨境电商AI自动化平台

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal.svg)](https://fastapi.tiangolo.com/)

面向东南亚市场的智能跨境电商平台，集成AI内容生成、多语言支持、多货币结算的完整电商解决方案。

---

## 📖 项目概述

TradeCraft是一个现代化的跨境电商平台，专为中国商家拓展印度尼西亚和马来西亚市场而设计。平台整合了前沿的AI技术，实现商品描述的智能生成和多语言翻译，大幅降低运营成本，提升市场竞争力。

### 核心特性

- **🤖 AI智能内容生成**：集成文心一言、GLM-4、Azure翻译，自动生成多语言商品描述
- **🌍 多语言支持**：中文、英文、印尼语无缝切换
- **💱 多货币结算**：支持CNY、USD、IDR、MYR实时汇率转换
- **💳 多种支付方式**：Stripe、PayPal、货到付款（COD）
- **📊 数据分析**：销售报表、用户行为分析、Google Analytics 4集成
- **🎨 现代化UI**：基于Next.js 14 + Tailwind CSS的响应式设计
- **🔒 安全可靠**：JWT认证、HTTPS加密、OWASP安全实践

---

## 🎯 快速导航

### 🚀 快速开始
- **[快速开始指南](QUICKSTART.md)** - 5分钟启动开发环境
- **[技术栈详解](TECH_STACK.md)** - 完整技术栈说明
- **[常见问题FAQ](FAQ.md)** - 27个常见问题解答

### 📚 需求与设计
- **[产品需求文档（PRD）](prd.md)** - 完整的业务需求和用户故事
- **[技术设计文档（TDD）](tdd.md)** - 系统架构和技术方案

### 📝 开发计划
- **[开发计划导览](DEVELOPMENT_PLAN_README.md)** - 文档阅读指南
- **[开发计划概要](DEVELOPMENT_PLAN_SUMMARY.md)** - 12周开发时间线
- **[详细计划 PART1](DEVELOPMENT_PLAN.md)** - Week 1-2：基础架构
- **[详细计划 PART2](DEVELOPMENT_PLAN_PART2.md)** - Week 3-4：商品管理与AI
- **[详细计划 PART3](DEVELOPMENT_PLAN_PART3.md)** - Week 5-6：前台页面
- **[详细计划 PART4](DEVELOPMENT_PLAN_PART4.md)** - Week 7-8：用户认证与购物车
- **[详细计划 PART5](DEVELOPMENT_PLAN_PART5.md)** - Week 9-12：支付、分析、部署

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                         用户层                                │
│  Web浏览器 (Chrome, Safari, Firefox) + 移动端响应式          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      前端层 (Next.js 14)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  App Router  │  │   Tailwind   │  │    Zustand   │      │
│  │  (SSR/SSG)   │  │   CSS + UI   │  │  (状态管理)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
┌───────────────────────────┐ ┌─────────────────────────────┐
│   后端层 (Spring Boot)     │ │   AI服务层 (FastAPI)         │
│  ┌─────────────────────┐  │ │  ┌───────────────────────┐  │
│  │  REST API + JWT     │  │ │  │  文心一言 API          │  │
│  │  JPA + MapStruct    │  │ │  │  GLM-4 API            │  │
│  │  Stripe + PayPal    │  │ │  │  Azure Translator     │  │
│  └─────────────────────┘  │ │  └───────────────────────┘  │
└───────────────────────────┘ └─────────────────────────────┘
            │                             │
            ├─────────────────────────────┤
            │                             │
┌───────────────────────────────────────────────────────────┐
│                    数据层                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ PostgreSQL   │  │    Redis     │  │  阿里云OSS    │   │
│  │   (主库)     │  │   (缓存)     │  │  (文件存储)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└───────────────────────────────────────────────────────────┘
```

### 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| **前端** | Next.js | 14.0.4 |
| | React | 18.2.0 |
| | TypeScript | 5.3.3 |
| | Tailwind CSS | 3.4.0 |
| | Zustand | 4.4.7 |
| **后端** | Spring Boot | 3.2.0 |
| | Java | 17 (LTS) |
| | PostgreSQL | 15 |
| | Redis | 7.2 |
| | Flyway | 9.22.3 |
| **AI服务** | FastAPI | 0.109.0 |
| | Python | 3.11+ |
| | 文心一言 | Latest |
| | GLM-4 | Latest |
| **支付** | Stripe | 24.3.0 |
| | PayPal | 2.0.0 |
| **基础设施** | Docker | >= 20.10 |
| | Nginx | Alpine |
| | GitHub Actions | - |

---

## 🚀 快速开始

### 前置要求

- Docker Desktop (>= 20.10)
- Docker Compose (>= 2.0)
- Java 17 (JDK)
- Node.js (>= 18.17)
- Python (>= 3.11)

### 启动步骤

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/TradeCraft.git
cd TradeCraft

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入必要配置

# 3. 启动基础服务
docker-compose up -d db redis

# 4. 启动后端
cd backend
./mvnw spring-boot:run

# 5. 启动前端（新终端）
cd frontend
npm install
npm run dev

# 6. 启动AI服务（新终端）
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

访问：
- **前端**: http://localhost:3000
- **后端API**: http://localhost:8080
- **Swagger文档**: http://localhost:8080/swagger-ui.html
- **AI服务**: http://localhost:8000/docs

更多详情请查看 **[快速开始指南](QUICKSTART.md)**

---

## 📊 开发进度

### MVP开发时间线（12周）

| 周次 | 里程碑 | 状态 |
|------|--------|------|
| Week 1-2 | 基础架构（项目初始化、数据库设计） | ✅ 规划完成 |
| Week 3-4 | 商品管理模块（CRUD + AI生成） | ✅ 规划完成 |
| Week 5-6 | 前台页面（首页、商品列表、详情） | ✅ 规划完成 |
| Week 7-8 | 用户认证与购物车 | ✅ 规划完成 |
| Week 9-10 | 支付集成与订单管理 | ✅ 规划完成 |
| Week 11-12 | 数据分析、测试、部署 | ✅ 规划完成 |

**当前状态**：详细开发计划已完成，包含6500+行可执行代码示例

---

## 📈 项目统计

- **代码行数**：~63,000行（含文档）
- **数据库表**：14张
- **API端点**：50+个
- **UI组件**：60+个
- **开发周期**：12周（MVP）
- **文档页数**：20,000+行

---

## 📝 文档索引

### 入门文档
- [快速开始](QUICKSTART.md) - 5分钟快速启动
- [技术栈详解](TECH_STACK.md) - 完整技术栈说明
- [常见问题FAQ](FAQ.md) - 27个常见问题解答

### 需求与设计
- [产品需求文档（PRD）](prd.md) - 业务需求
- [技术设计文档（TDD）](tdd.md) - 技术架构

### 开发计划（6500+行代码示例）
- [开发计划导览](DEVELOPMENT_PLAN_README.md) - 阅读指南
- [开发计划概要](DEVELOPMENT_PLAN_SUMMARY.md) - 12周时间线
- [Week 1-2](DEVELOPMENT_PLAN.md) - 基础架构搭建
- [Week 3-4](DEVELOPMENT_PLAN_PART2.md) - 商品管理与AI
- [Week 5-6](DEVELOPMENT_PLAN_PART3.md) - 前台页面
- [Week 7-8](DEVELOPMENT_PLAN_PART4.md) - 用户认证与购物车
- [Week 9-12](DEVELOPMENT_PLAN_PART5.md) - 支付、分析、部署

---

## 🙏 致谢

- [Spring Boot](https://spring.io/projects/spring-boot) - 强大的Java框架
- [Next.js](https://nextjs.org/) - 优秀的React框架
- [FastAPI](https://fastapi.tiangolo.com/) - 高性能Python框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用的CSS框架
- [Shadcn UI](https://ui.shadcn.com/) - 精美的组件库

---

**⭐ 如果这个项目对你有帮助，请给个Star！**

**最后更新**：2025年11月16日
**版本**：v1.0.0
**状态**：开发计划完成，待实现
