#!/bin/bash

# ==========================================
# TradeCraft 本地开发环境一键设置脚本
# ==========================================
# 功能：
# 1. 检查系统环境（Java、Node.js、Python、Docker）
# 2. 创建 .env 文件
# 3. 安装所有依赖
# 4. 启动数据库和Redis
# 5. 初始化数据库
# 6. 启动所有服务
# ==========================================

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查版本
check_version() {
    local cmd="$1"
    local min_version="$2"
    local current_version="$3"

    if [ "$(printf '%s\n' "$min_version" "$current_version" | sort -V | head -n1)" != "$min_version" ]; then
        log_error "$cmd version $current_version is too old. Required: $min_version+"
        return 1
    else
        log_info "✓ $cmd version $current_version"
        return 0
    fi
}

# 检查系统环境
check_environment() {
    log_step "检查系统环境..."

    local all_ok=true

    # 检查Java
    if command_exists java; then
        local java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
        if [ "$java_version" -ge 17 ]; then
            log_info "✓ Java $java_version"
        else
            log_error "Java version too old. Required: Java 17+"
            all_ok=false
        fi
    else
        log_error "Java not found. Please install Java 17+"
        all_ok=false
    fi

    # 检查Maven
    if command_exists mvn; then
        local mvn_version=$(mvn -version | head -n1 | awk '{print $3}')
        log_info "✓ Maven $mvn_version"
    else
        log_warn "Maven not found. Using Maven wrapper (./mvnw)"
    fi

    # 检查Node.js
    if command_exists node; then
        local node_version=$(node -v | sed 's/v//')
        check_version "Node.js" "18.0.0" "$node_version" || all_ok=false
    else
        log_error "Node.js not found. Please install Node.js 18+"
        all_ok=false
    fi

    # 检查npm
    if command_exists npm; then
        local npm_version=$(npm -v)
        log_info "✓ npm $npm_version"
    else
        log_error "npm not found"
        all_ok=false
    fi

    # 检查Python
    if command_exists python3; then
        local python_version=$(python3 --version | awk '{print $2}')
        check_version "Python" "3.11.0" "$python_version" || all_ok=false
    else
        log_error "Python 3 not found. Please install Python 3.11+"
        all_ok=false
    fi

    # 检查pip
    if command_exists pip3; then
        local pip_version=$(pip3 --version | awk '{print $2}')
        log_info "✓ pip $pip_version"
    else
        log_error "pip3 not found"
        all_ok=false
    fi

    # 检查Docker
    if command_exists docker; then
        local docker_version=$(docker --version | awk '{print $3}' | sed 's/,//')
        log_info "✓ Docker $docker_version"

        # 检查Docker是否运行
        if docker ps >/dev/null 2>&1; then
            log_info "✓ Docker daemon running"
        else
            log_error "Docker daemon not running. Please start Docker"
            all_ok=false
        fi
    else
        log_error "Docker not found. Please install Docker"
        all_ok=false
    fi

    # 检查Docker Compose
    if command_exists docker-compose; then
        local compose_version=$(docker-compose --version | awk '{print $4}' | sed 's/,//')
        log_info "✓ Docker Compose $compose_version"
    else
        log_error "Docker Compose not found. Please install Docker Compose"
        all_ok=false
    fi

    if $all_ok; then
        log_info "所有环境检查通过！"
        return 0
    else
        log_error "环境检查失败，请安装缺失的依赖"
        return 1
    fi
}

# 创建 .env 文件
create_env_file() {
    log_step "创建 .env 文件..."

    cd "$PROJECT_ROOT"

    if [ -f .env ]; then
        log_warn ".env 文件已存在"
        read -p "是否覆盖？(y/n): " overwrite
        if [ "$overwrite" != "y" ]; then
            log_info "保留现有 .env 文件"
            return 0
        fi
    fi

    if [ -f .env.example ]; then
        cp .env.example .env
        log_info "已从 .env.example 创建 .env 文件"

        # 生成随机JWT密钥
        if command_exists openssl; then
            local jwt_secret=$(openssl rand -base64 64 | tr -d '\n')
            sed -i.bak "s|your-super-secret-jwt-key-min-512-bits|$jwt_secret|g" .env
            rm -f .env.bak
            log_info "已生成随机 JWT 密钥"
        fi

        log_warn "请编辑 .env 文件，填入必要的API密钥："
        echo "  - WENXIN_API_KEY (文心一言)"
        echo "  - GLM_API_KEY (GLM-4)"
        echo "  - AZURE_TRANSLATOR_KEY (Azure翻译)"
        echo "  - STRIPE_SECRET_KEY (Stripe支付)"
        echo "  - PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET (PayPal)"
        echo ""
        read -p "按Enter继续..."
    else
        log_error ".env.example 文件不存在"
        return 1
    fi
}

# 安装后端依赖
install_backend_deps() {
    log_step "安装后端依赖..."

    cd "$PROJECT_ROOT/backend"

    if [ -f pom.xml ]; then
        log_info "使用 Maven 安装依赖..."
        if [ -f ./mvnw ]; then
            ./mvnw clean install -DskipTests
        else
            mvn clean install -DskipTests
        fi
        log_info "后端依赖安装完成"
    else
        log_warn "未找到 backend/pom.xml，跳过"
    fi
}

# 安装前端依赖
install_frontend_deps() {
    log_step "安装前端依赖..."

    cd "$PROJECT_ROOT/frontend"

    if [ -f package.json ]; then
        log_info "使用 npm 安装依赖..."
        npm install
        log_info "前端依赖安装完成"
    else
        log_warn "未找到 frontend/package.json，跳过"
    fi
}

# 安装AI服务依赖
install_ai_deps() {
    log_step "安装AI服务依赖..."

    cd "$PROJECT_ROOT/ai-service"

    if [ -f requirements.txt ]; then
        log_info "使用 pip 安装依赖..."

        # 检查是否使用虚拟环境
        if [ ! -d venv ]; then
            log_info "创建 Python 虚拟环境..."
            python3 -m venv venv
        fi

        log_info "激活虚拟环境并安装依赖..."
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
        deactivate

        log_info "AI服务依赖安装完成"
        log_warn "启动AI服务时请先激活虚拟环境: source ai-service/venv/bin/activate"
    else
        log_warn "未找到 ai-service/requirements.txt，跳过"
    fi
}

# 启动数据库和Redis
start_infrastructure() {
    log_step "启动数据库和Redis..."

    cd "$PROJECT_ROOT"

    if [ -f docker-compose.yml ]; then
        log_info "启动 PostgreSQL 和 Redis..."
        docker-compose up -d db redis

        log_info "等待服务启动..."
        sleep 5

        # 检查服务状态
        if docker-compose ps | grep -q "db.*Up"; then
            log_info "✓ PostgreSQL 启动成功"
        else
            log_error "PostgreSQL 启动失败"
            return 1
        fi

        if docker-compose ps | grep -q "redis.*Up"; then
            log_info "✓ Redis 启动成功"
        else
            log_error "Redis 启动失败"
            return 1
        fi
    else
        log_error "docker-compose.yml 不存在"
        return 1
    fi
}

# 初始化数据库
initialize_database() {
    log_step "初始化数据库..."

    cd "$PROJECT_ROOT"

    # 检查初始化脚本
    if [ -f scripts/database/init-db.sql ]; then
        log_info "执行数据库初始化脚本..."

        local db_container=$(docker-compose ps -q db)
        local db_name="${DB_NAME:-tradecraft_dev}"
        local db_user="${DB_USERNAME:-tradecraft}"

        if docker exec -i "$db_container" psql -U "$db_user" -d "$db_name" < scripts/database/init-db.sql; then
            log_info "数据库初始化成功"
        else
            log_warn "数据库初始化失败，可能已经初始化过"
        fi
    else
        log_warn "数据库初始化脚本不存在: scripts/database/init-db.sql"
    fi

    # Flyway 迁移将在启动后端时自动执行
    log_info "Flyway 迁移将在首次启动后端时自动执行"
}

# 创建启动脚本
create_start_script() {
    log_step "创建启动脚本..."

    cd "$PROJECT_ROOT"

    cat > start-dev.sh << 'EOF'
#!/bin/bash

# TradeCraft 开发环境启动脚本

echo "========================================="
echo "TradeCraft 开发环境启动"
echo "========================================="

# 启动后端（新终端）
echo "启动后端服务..."
gnome-terminal --tab --title="Backend" -- bash -c "cd backend && ./mvnw spring-boot:run; exec bash" 2>/dev/null || \
xterm -T "Backend" -e "cd backend && ./mvnw spring-boot:run; bash" 2>/dev/null || \
echo "无法自动打开终端，请手动运行: cd backend && ./mvnw spring-boot:run"

sleep 2

# 启动前端（新终端）
echo "启动前端服务..."
gnome-terminal --tab --title="Frontend" -- bash -c "cd frontend && npm run dev; exec bash" 2>/dev/null || \
xterm -T "Frontend" -e "cd frontend && npm run dev; bash" 2>/dev/null || \
echo "无法自动打开终端，请手动运行: cd frontend && npm run dev"

sleep 2

# 启动AI服务（新终端）
echo "启动AI服务..."
gnome-terminal --tab --title="AI Service" -- bash -c "cd ai-service && source venv/bin/activate && uvicorn main:app --reload; exec bash" 2>/dev/null || \
xterm -T "AI Service" -e "cd ai-service && source venv/bin/activate && uvicorn main:app --reload; bash" 2>/dev/null || \
echo "无法自动打开终端，请手动运行: cd ai-service && source venv/bin/activate && uvicorn main:app --reload"

echo ""
echo "========================================="
echo "服务启动中..."
echo "========================================="
echo "后端: http://localhost:8080/swagger-ui.html"
echo "前端: http://localhost:3000"
echo "AI服务: http://localhost:8000/docs"
echo "========================================="
EOF

    chmod +x start-dev.sh
    log_info "启动脚本已创建: start-dev.sh"
}

# 显示下一步说明
show_next_steps() {
    echo ""
    echo "========================================="
    log_info "本地开发环境设置完成！"
    echo "========================================="
    echo ""
    echo "下一步："
    echo ""
    echo "1. 编辑 .env 文件，填入API密钥"
    echo "   vim .env"
    echo ""
    echo "2. 启动所有服务"
    echo "   ./start-dev.sh"
    echo ""
    echo "   或手动启动："
    echo "   - 后端:   cd backend && ./mvnw spring-boot:run"
    echo "   - 前端:   cd frontend && npm run dev"
    echo "   - AI服务: cd ai-service && source venv/bin/activate && uvicorn main:app --reload"
    echo ""
    echo "3. 访问应用"
    echo "   - 前端:       http://localhost:3000"
    echo "   - 后端API:    http://localhost:8080/swagger-ui.html"
    echo "   - AI服务:     http://localhost:8000/docs"
    echo "   - pgAdmin:    http://localhost:5050 (可选)"
    echo "   - Redis UI:   http://localhost:8081 (可选)"
    echo ""
    echo "========================================="
}

# 显示使用帮助
show_help() {
    cat << EOF
TradeCraft Local Development Setup Script

Usage: $0 [OPTIONS]

Options:
    -h, --help              显示帮助信息
    --skip-env              跳过 .env 文件创建
    --skip-deps             跳过依赖安装
    --skip-infra            跳过基础设施启动
    --skip-db-init          跳过数据库初始化

Examples:
    # 完整设置
    $0

    # 仅检查环境
    $0 --skip-deps --skip-infra --skip-db-init

    # 跳过依赖安装（已安装过）
    $0 --skip-deps

EOF
}

# 主函数
main() {
    echo "========================================="
    echo "TradeCraft 本地开发环境设置"
    echo "========================================="
    echo ""

    # 检查环境
    if ! check_environment; then
        exit 1
    fi

    echo ""

    # 创建 .env
    if [ "$SKIP_ENV" != "true" ]; then
        create_env_file
        echo ""
    fi

    # 安装依赖
    if [ "$SKIP_DEPS" != "true" ]; then
        install_backend_deps
        echo ""
        install_frontend_deps
        echo ""
        install_ai_deps
        echo ""
    fi

    # 启动基础设施
    if [ "$SKIP_INFRA" != "true" ]; then
        start_infrastructure
        echo ""
    fi

    # 初始化数据库
    if [ "$SKIP_DB_INIT" != "true" ]; then
        initialize_database
        echo ""
    fi

    # 创建启动脚本
    create_start_script

    # 显示下一步
    show_next_steps
}

# 解析命令行参数
SKIP_ENV=false
SKIP_DEPS=false
SKIP_INFRA=false
SKIP_DB_INIT=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --skip-env)
            SKIP_ENV=true
            shift
            ;;
        --skip-deps)
            SKIP_DEPS=true
            shift
            ;;
        --skip-infra)
            SKIP_INFRA=true
            shift
            ;;
        --skip-db-init)
            SKIP_DB_INIT=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# 执行主函数
main
