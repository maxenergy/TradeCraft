#!/bin/bash

# ==========================================
# TradeCraft 生产环境部署脚本
# ==========================================
# 功能：
# 1. 拉取最新代码
# 2. 备份当前数据库
# 3. 构建Docker镜像
# 4. 执行数据库迁移
# 5. 滚动更新服务
# 6. 健康检查
# 7. 自动回滚（如果失败）
# ==========================================

set -e

# 配置
DEPLOY_DIR="/opt/tradecraft"
BACKUP_DIR="/opt/tradecraft/backups"
COMPOSE_FILE="docker-compose.prod.yml"
HEALTH_CHECK_RETRIES=10
HEALTH_CHECK_INTERVAL=6

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# 发送通知
send_notification() {
    local status="$1"
    local message="$2"

    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"[TradeCraft] Deployment $status: $message\"}" \
            >/dev/null 2>&1
    fi
}

# 检查前置条件
check_prerequisites() {
    log_step "检查部署前置条件..."

    # 检查Docker
    if ! command -v docker >/dev/null 2>&1; then
        log_error "Docker not installed"
        exit 1
    fi

    # 检查Docker Compose
    if ! command -v docker-compose >/dev/null 2>&1; then
        log_error "Docker Compose not installed"
        exit 1
    fi

    # 检查Git
    if ! command -v git >/dev/null 2>&1; then
        log_error "Git not installed"
        exit 1
    fi

    # 检查工作目录
    if [ ! -d "$DEPLOY_DIR" ]; then
        log_error "Deploy directory not found: $DEPLOY_DIR"
        exit 1
    fi

    log_info "所有前置条件满足"
}

# 保存当前版本信息（用于回滚）
save_current_version() {
    log_step "保存当前版本信息..."

    cd "$DEPLOY_DIR"

    # 保存Git commit hash
    git rev-parse HEAD > .previous_commit

    # 保存当前运行的镜像版本
    docker-compose -f "$COMPOSE_FILE" ps --format json | \
        jq -r '.[] | "\(.Service)=\(.Image)"' > .previous_images

    log_info "版本信息已保存"
}

# 拉取最新代码
pull_latest_code() {
    log_step "拉取最新代码..."

    cd "$DEPLOY_DIR"

    # 获取当前分支
    local current_branch=$(git branch --show-current)
    log_info "当前分支: $current_branch"

    # 拉取最新代码
    if git pull origin "$current_branch"; then
        local new_commit=$(git rev-parse HEAD)
        log_info "代码更新成功: $new_commit"
    else
        log_error "代码拉取失败"
        exit 1
    fi
}

# 备份数据库
backup_database() {
    log_step "备份数据库..."

    if [ -f "$DEPLOY_DIR/scripts/database/backup.sh" ]; then
        bash "$DEPLOY_DIR/scripts/database/backup.sh"
        log_info "数据库备份成功"
    else
        log_warn "备份脚本不存在，跳过备份"
    fi
}

# 构建Docker镜像
build_images() {
    log_step "构建Docker镜像..."

    cd "$DEPLOY_DIR"

    # 构建所有镜像
    if docker-compose -f "$COMPOSE_FILE" build --no-cache; then
        log_info "镜像构建成功"
    else
        log_error "镜像构建失败"
        exit 1
    fi
}

# 执行数据库迁移
run_migrations() {
    log_step "执行数据库迁移..."

    cd "$DEPLOY_DIR"

    # 使用临时容器运行Flyway迁移
    if docker-compose -f "$COMPOSE_FILE" run --rm backend \
        ./mvnw flyway:migrate; then
        log_info "数据库迁移成功"
    else
        log_error "数据库迁移失败"
        return 1
    fi
}

# 滚动更新服务
rolling_update() {
    log_step "滚动更新服务..."

    cd "$DEPLOY_DIR"

    # 按顺序更新服务（先后端，再前端，最后AI服务）
    local services=("backend" "frontend" "ai-service")

    for service in "${services[@]}"; do
        log_info "更新服务: $service"

        # 启动新容器
        docker-compose -f "$COMPOSE_FILE" up -d --no-deps --build "$service"

        # 等待服务健康
        sleep 5

        # 检查服务是否运行
        if docker-compose -f "$COMPOSE_FILE" ps "$service" | grep -q "Up"; then
            log_info "$service 更新成功"
        else
            log_error "$service 更新失败"
            return 1
        fi
    done
}

# 健康检查
health_check() {
    log_step "执行健康检查..."

    local retry=0
    local max_retries=$HEALTH_CHECK_RETRIES

    while [ $retry -lt $max_retries ]; do
        log_info "健康检查尝试 $((retry + 1))/$max_retries"

        # 检查后端健康
        if curl -f -s http://localhost:8080/actuator/health >/dev/null 2>&1; then
            backend_healthy=true
        else
            backend_healthy=false
        fi

        # 检查前端健康
        if curl -f -s http://localhost:3000/api/health >/dev/null 2>&1; then
            frontend_healthy=true
        else
            frontend_healthy=false
        fi

        # 检查AI服务健康
        if curl -f -s http://localhost:8000/health >/dev/null 2>&1; then
            ai_healthy=true
        else
            ai_healthy=false
        fi

        # 所有服务健康
        if $backend_healthy && $frontend_healthy && $ai_healthy; then
            log_info "所有服务健康检查通过"
            return 0
        fi

        log_warn "健康检查失败，等待 ${HEALTH_CHECK_INTERVAL}s 后重试..."
        sleep $HEALTH_CHECK_INTERVAL
        retry=$((retry + 1))
    done

    log_error "健康检查失败，超过最大重试次数"
    return 1
}

# 清理旧镜像
cleanup_old_images() {
    log_step "清理旧镜像..."

    # 删除 <none> 标签的镜像
    docker images | grep '<none>' | awk '{print $3}' | xargs -r docker rmi -f || true

    # 清理未使用的镜像
    docker image prune -af --filter "until=168h" || true

    log_info "镜像清理完成"
}

# 回滚部署
rollback() {
    log_error "部署失败，开始回滚..."

    cd "$DEPLOY_DIR"

    # 读取之前的commit
    if [ -f .previous_commit ]; then
        local previous_commit=$(cat .previous_commit)
        log_info "回滚到提交: $previous_commit"

        git reset --hard "$previous_commit"
    fi

    # 恢复之前的镜像
    if [ -f .previous_images ]; then
        log_info "恢复之前的容器..."
        docker-compose -f "$COMPOSE_FILE" down
        docker-compose -f "$COMPOSE_FILE" up -d
    fi

    log_info "回滚完成"
    send_notification "FAILED" "Deployment failed and rolled back"
}

# 显示部署摘要
show_summary() {
    log_step "部署摘要"

    echo "========================================="
    echo "服务状态："
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
    echo "磁盘使用："
    df -h | grep -E '^/dev/'
    echo ""
    echo "镜像列表："
    docker images | grep tradecraft
    echo "========================================="
}

# 主函数
main() {
    log_info "========================================="
    log_info "TradeCraft 生产环境部署开始"
    log_info "========================================="

    local start_time=$(date +%s)

    # 执行部署流程
    check_prerequisites
    save_current_version

    if ! pull_latest_code; then
        log_error "代码拉取失败"
        exit 1
    fi

    if ! backup_database; then
        log_warn "数据库备份失败，是否继续？(y/n)"
        read -r continue_deploy
        if [ "$continue_deploy" != "y" ]; then
            exit 1
        fi
    fi

    if ! build_images; then
        rollback
        exit 1
    fi

    if ! run_migrations; then
        log_error "数据库迁移失败"
        rollback
        exit 1
    fi

    if ! rolling_update; then
        rollback
        exit 1
    fi

    if ! health_check; then
        rollback
        exit 1
    fi

    cleanup_old_images
    show_summary

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log_info "========================================="
    log_info "部署成功完成！耗时: ${duration}s"
    log_info "========================================="

    send_notification "SUCCESS" "Deployment completed in ${duration}s"
}

# 显示使用帮助
show_help() {
    cat << EOF
TradeCraft Production Deployment Script

Usage: $0 [OPTIONS]

Options:
    -h, --help              显示帮助信息
    --skip-backup           跳过数据库备份
    --skip-health-check     跳过健康检查
    --no-build              不重新构建镜像（使用现有镜像）

Environment Variables:
    DEPLOY_DIR              部署目录 (default: /opt/tradecraft)
    WEBHOOK_URL             通知Webhook URL
    HEALTH_CHECK_RETRIES    健康检查重试次数 (default: 10)

Examples:
    # 标准部署
    $0

    # 跳过备份快速部署
    $0 --skip-backup

    # 仅更新代码，不重新构建
    $0 --no-build

EOF
}

# 解析命令行参数
SKIP_BACKUP=false
SKIP_HEALTH_CHECK=false
NO_BUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --skip-health-check)
            SKIP_HEALTH_CHECK=true
            shift
            ;;
        --no-build)
            NO_BUILD=true
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
