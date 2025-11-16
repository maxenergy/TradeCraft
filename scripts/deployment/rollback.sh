#!/bin/bash

# ==========================================
# TradeCraft 生产环境回滚脚本
# ==========================================
# 功能：
# 1. 查看可回滚的版本
# 2. 回滚到指定Git commit
# 3. 恢复数据库备份
# 4. 重启服务
# 5. 验证回滚结果
# ==========================================

set -e

# 配置
DEPLOY_DIR="/opt/tradecraft"
BACKUP_DIR="/opt/tradecraft/backups"
COMPOSE_FILE="docker-compose.prod.yml"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 显示可回滚的版本
list_versions() {
    log_step "可回滚的版本（最近10次部署）："

    cd "$DEPLOY_DIR"

    echo "========================================="
    echo "Git Commits:"
    git log --oneline --decorate -10
    echo ""
    echo "Database Backups:"
    ls -lht "$BACKUP_DIR" | head -11
    echo "========================================="
}

# 确认回滚操作
confirm_rollback() {
    local target_commit="$1"

    echo ""
    log_warn "WARNING: 即将回滚到 commit: $target_commit"
    log_warn "这将："
    echo "  1. 重置代码到指定版本"
    echo "  2. 可选：恢复数据库备份"
    echo "  3. 重启所有服务"
    echo ""

    read -p "确认继续？(yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        log_info "回滚已取消"
        exit 0
    fi
}

# 备份当前状态
backup_current_state() {
    log_step "备份当前状态..."

    cd "$DEPLOY_DIR"

    # 保存当前commit
    local current_commit=$(git rev-parse HEAD)
    echo "$current_commit" > ".rollback_from_$(date +%Y%m%d_%H%M%S)"

    # 备份当前数据库
    if [ -f "$DEPLOY_DIR/scripts/database/backup.sh" ]; then
        bash "$DEPLOY_DIR/scripts/database/backup.sh"
        log_info "当前状态备份完成"
    fi
}

# 回滚代码
rollback_code() {
    local target_commit="$1"

    log_step "回滚代码到: $target_commit"

    cd "$DEPLOY_DIR"

    # 保存未提交的更改
    git stash push -m "Auto stash before rollback $(date +%Y%m%d_%H%M%S)"

    # 硬重置到目标commit
    if git reset --hard "$target_commit"; then
        log_info "代码回滚成功"
        return 0
    else
        log_error "代码回滚失败"
        return 1
    fi
}

# 恢复数据库
restore_database() {
    local backup_file="$1"

    log_step "恢复数据库: $backup_file"

    # 确认数据库恢复
    log_warn "WARNING: 即将恢复数据库，这将覆盖当前数据！"
    read -p "确认恢复数据库？(yes/no): " confirm_db

    if [ "$confirm_db" != "yes" ]; then
        log_info "跳过数据库恢复"
        return 0
    fi

    # 停止后端服务
    docker-compose -f "$COMPOSE_FILE" stop backend

    # 解压备份文件
    local sql_file="${backup_file%.gz}"
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" > "$sql_file"
    fi

    # 获取数据库配置
    local db_container=$(docker-compose -f "$COMPOSE_FILE" ps -q db)
    local db_name="${DB_NAME:-tradecraft_prod}"
    local db_user="${DB_USERNAME:-tradecraft}"

    # 恢复数据库
    if docker exec -i "$db_container" psql -U "$db_user" -d "$db_name" < "$sql_file"; then
        log_info "数据库恢复成功"

        # 清理临时文件
        if [[ "$backup_file" == *.gz ]]; then
            rm -f "$sql_file"
        fi

        return 0
    else
        log_error "数据库恢复失败"
        return 1
    fi
}

# 重新构建并启动服务
rebuild_and_restart() {
    log_step "重新构建并启动服务..."

    cd "$DEPLOY_DIR"

    # 停止所有服务
    docker-compose -f "$COMPOSE_FILE" down

    # 重新构建镜像
    if docker-compose -f "$COMPOSE_FILE" build; then
        log_info "镜像构建成功"
    else
        log_error "镜像构建失败"
        return 1
    fi

    # 启动所有服务
    if docker-compose -f "$COMPOSE_FILE" up -d; then
        log_info "服务启动成功"
    else
        log_error "服务启动失败"
        return 1
    fi

    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
}

# 验证回滚结果
verify_rollback() {
    log_step "验证回滚结果..."

    local all_healthy=true

    # 检查后端
    if curl -f -s http://localhost:8080/actuator/health >/dev/null 2>&1; then
        log_info "✓ 后端服务健康"
    else
        log_error "✗ 后端服务异常"
        all_healthy=false
    fi

    # 检查前端
    if curl -f -s http://localhost:3000 >/dev/null 2>&1; then
        log_info "✓ 前端服务健康"
    else
        log_error "✗ 前端服务异常"
        all_healthy=false
    fi

    # 检查AI服务
    if curl -f -s http://localhost:8000/health >/dev/null 2>&1; then
        log_info "✓ AI服务健康"
    else
        log_error "✗ AI服务异常"
        all_healthy=false
    fi

    # 显示服务状态
    echo ""
    docker-compose -f "$COMPOSE_FILE" ps

    if $all_healthy; then
        return 0
    else
        return 1
    fi
}

# 快速回滚到上一个版本
quick_rollback() {
    log_step "快速回滚到上一个版本..."

    cd "$DEPLOY_DIR"

    # 获取上一个commit
    local previous_commit=$(git rev-parse HEAD~1)

    log_info "目标版本: $previous_commit"
    log_info "$(git log -1 --oneline $previous_commit)"

    confirm_rollback "$previous_commit"
    backup_current_state

    if ! rollback_code "$previous_commit"; then
        log_error "回滚失败"
        exit 1
    fi

    rebuild_and_restart

    if verify_rollback; then
        log_info "========================================="
        log_info "快速回滚成功！"
        log_info "========================================="
    else
        log_error "回滚后服务异常，请检查日志"
        exit 1
    fi
}

# 回滚到指定版本
rollback_to_version() {
    local target_commit="$1"
    local backup_file="$2"

    cd "$DEPLOY_DIR"

    # 验证commit存在
    if ! git cat-file -e "$target_commit^{commit}" 2>/dev/null; then
        log_error "Invalid commit: $target_commit"
        exit 1
    fi

    log_info "目标版本: $target_commit"
    log_info "$(git log -1 --oneline $target_commit)"

    confirm_rollback "$target_commit"
    backup_current_state

    if ! rollback_code "$target_commit"; then
        log_error "代码回滚失败"
        exit 1
    fi

    # 恢复数据库（可选）
    if [ -n "$backup_file" ]; then
        if [ ! -f "$backup_file" ]; then
            log_error "备份文件不存在: $backup_file"
            exit 1
        fi

        if ! restore_database "$backup_file"; then
            log_error "数据库恢复失败"
            exit 1
        fi
    fi

    rebuild_and_restart

    if verify_rollback; then
        log_info "========================================="
        log_info "回滚成功！"
        log_info "当前版本: $(git rev-parse HEAD)"
        log_info "========================================="
    else
        log_error "回滚后服务异常，请检查日志"
        exit 1
    fi
}

# 显示使用帮助
show_help() {
    cat << EOF
TradeCraft Production Rollback Script

Usage: $0 [OPTIONS] [COMMIT] [BACKUP_FILE]

Options:
    -h, --help              显示帮助信息
    -l, --list              列出可回滚的版本
    -q, --quick             快速回滚到上一个版本
    -c, --commit COMMIT     回滚到指定commit
    -b, --backup FILE       恢复指定的数据库备份

Examples:
    # 列出可回滚的版本
    $0 --list

    # 快速回滚到上一个版本
    $0 --quick

    # 回滚到指定commit
    $0 --commit abc123

    # 回滚代码并恢复数据库
    $0 --commit abc123 --backup /path/to/backup.sql.gz

EOF
}

# 主函数
main() {
    log_info "========================================="
    log_info "TradeCraft 生产环境回滚工具"
    log_info "========================================="

    # 检查工作目录
    if [ ! -d "$DEPLOY_DIR" ]; then
        log_error "部署目录不存在: $DEPLOY_DIR"
        exit 1
    fi

    # 默认操作：列出版本
    if [ $# -eq 0 ]; then
        list_versions
        echo ""
        log_info "使用 --help 查看更多选项"
        exit 0
    fi
}

# 解析命令行参数
TARGET_COMMIT=""
BACKUP_FILE=""
ACTION=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -l|--list)
            list_versions
            exit 0
            ;;
        -q|--quick)
            ACTION="quick"
            shift
            ;;
        -c|--commit)
            TARGET_COMMIT="$2"
            ACTION="specific"
            shift 2
            ;;
        -b|--backup)
            BACKUP_FILE="$2"
            shift 2
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# 执行操作
main

if [ "$ACTION" = "quick" ]; then
    quick_rollback
elif [ "$ACTION" = "specific" ]; then
    rollback_to_version "$TARGET_COMMIT" "$BACKUP_FILE"
fi
