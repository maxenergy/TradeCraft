# ==========================================
# TradeCraft Makefile
# ==========================================
# 快速命令集合
# ==========================================

.PHONY: help setup dev build test clean deploy

# 默认目标
.DEFAULT_GOAL := help

# ==========================================
# 帮助信息
# ==========================================
help:
	@echo "TradeCraft 可用命令："
	@echo ""
	@echo "  make setup        - 一键设置开发环境"
	@echo "  make dev          - 启动开发服务器"
	@echo "  make build        - 构建所有服务"
	@echo "  make test         - 运行所有测试"
	@echo "  make clean        - 清理构建产物"
	@echo "  make deploy       - 部署到生产环境"
	@echo ""
	@echo "  make db-init      - 初始化数据库"
	@echo "  make db-reset     - 重置数据库"
	@echo "  make db-backup    - 备份数据库"
	@echo "  make db-seed      - 加载测试数据"
	@echo ""
	@echo "  make backend-dev  - 启动后端开发服务器"
	@echo "  make frontend-dev - 启动前端开发服务器"
	@echo "  make ai-dev       - 启动AI服务开发服务器"
	@echo ""
	@echo "  make docker-up    - 启动Docker服务"
	@echo "  make docker-down  - 停止Docker服务"
	@echo "  make docker-logs  - 查看Docker日志"
	@echo ""

# ==========================================
# 开发环境设置
# ==========================================
setup:
	@echo "设置开发环境..."
	@chmod +x scripts/dev/setup-local.sh
	@./scripts/dev/setup-local.sh

# ==========================================
# 开发服务器
# ==========================================
dev:
	@echo "启动所有开发服务..."
	@make docker-up
	@sleep 5
	@make backend-dev & make frontend-dev & make ai-dev

backend-dev:
	@echo "启动后端服务..."
	@cd backend && ./mvnw spring-boot:run

frontend-dev:
	@echo "启动前端服务..."
	@cd frontend && npm run dev

ai-dev:
	@echo "启动AI服务..."
	@cd ai-service && source venv/bin/activate && uvicorn main:app --reload

# ==========================================
# 构建
# ==========================================
build:
	@echo "构建所有服务..."
	@make backend-build
	@make frontend-build
	@make ai-build

backend-build:
	@echo "构建后端..."
	@cd backend && ./mvnw clean package -DskipTests

frontend-build:
	@echo "构建前端..."
	@cd frontend && npm run build

ai-build:
	@echo "构建AI服务..."
	@cd ai-service && pip install -r requirements.txt

# ==========================================
# 测试
# ==========================================
test:
	@echo "运行所有测试..."
	@make backend-test
	@make frontend-test
	@make ai-test

backend-test:
	@echo "运行后端测试..."
	@cd backend && ./mvnw test

frontend-test:
	@echo "运行前端测试..."
	@cd frontend && npm test

ai-test:
	@echo "运行AI服务测试..."
	@cd ai-service && source venv/bin/activate && pytest

# ==========================================
# 代码质量
# ==========================================
lint:
	@echo "检查代码质量..."
	@cd frontend && npm run lint
	@cd ai-service && source venv/bin/activate && flake8

format:
	@echo "格式化代码..."
	@cd frontend && npm run format
	@cd ai-service && source venv/bin/activate && black .

# ==========================================
# 数据库
# ==========================================
db-init:
	@echo "初始化数据库..."
	@docker exec -i tradecraft-db psql -U tradecraft -d tradecraft_dev < scripts/database/init-db.sql

db-reset:
	@echo "重置数据库..."
	@chmod +x scripts/dev/reset-db.sh
	@./scripts/dev/reset-db.sh --force

db-backup:
	@echo "备份数据库..."
	@chmod +x scripts/database/backup.sh
	@./scripts/database/backup.sh

db-seed:
	@echo "加载测试数据..."
	@docker exec -i tradecraft-db psql -U tradecraft -d tradecraft_dev < scripts/database/test-data.sql

# ==========================================
# Docker
# ==========================================
docker-up:
	@echo "启动Docker服务..."
	@docker-compose up -d

docker-down:
	@echo "停止Docker服务..."
	@docker-compose down

docker-logs:
	@echo "查看Docker日志..."
	@docker-compose logs -f

docker-ps:
	@echo "查看Docker容器状态..."
	@docker-compose ps

docker-build:
	@echo "构建Docker镜像..."
	@docker-compose build

docker-clean:
	@echo "清理Docker资源..."
	@docker-compose down -v
	@docker system prune -f

# ==========================================
# 部署
# ==========================================
deploy:
	@echo "部署到生产环境..."
	@chmod +x scripts/deployment/deploy.sh
	@./scripts/deployment/deploy.sh

deploy-rollback:
	@echo "回滚部署..."
	@chmod +x scripts/deployment/rollback.sh
	@./scripts/deployment/rollback.sh --quick

health-check:
	@echo "执行健康检查..."
	@chmod +x scripts/deployment/health-check.sh
	@./scripts/deployment/health-check.sh

# ==========================================
# 清理
# ==========================================
clean:
	@echo "清理构建产物..."
	@cd backend && ./mvnw clean
	@cd frontend && rm -rf .next node_modules
	@cd ai-service && rm -rf __pycache__ .pytest_cache
	@find . -type d -name "target" -exec rm -rf {} +
	@find . -type f -name "*.pyc" -delete

clean-all: clean docker-clean
	@echo "清理所有资源..."

# ==========================================
# Git
# ==========================================
git-status:
	@git status

git-push:
	@git add -A
	@git commit -m "Update: $(shell date '+%Y-%m-%d %H:%M:%S')"
	@git push

# ==========================================
# 工具
# ==========================================
generate-keys:
	@echo "生成安全密钥..."
	@chmod +x scripts/dev/generate-keys.sh
	@./scripts/dev/generate-keys.sh

# ==========================================
# 监控
# ==========================================
logs-backend:
	@tail -f backend/logs/tradecraft.log

logs-frontend:
	@docker-compose logs -f frontend

logs-ai:
	@docker-compose logs -f ai-service

# ==========================================
# 开发工具
# ==========================================
install-deps:
	@echo "安装所有依赖..."
	@cd backend && ./mvnw dependency:resolve
	@cd frontend && npm install
	@cd ai-service && pip install -r requirements.txt

update-deps:
	@echo "更新所有依赖..."
	@cd frontend && npm update
	@cd ai-service && pip install --upgrade -r requirements.txt
