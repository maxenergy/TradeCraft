#!/bin/bash

# ==========================================
# TradeCraft 开发环境数据库重置脚本
# ==========================================
# 功能：
# 1. 备份当前数据库
# 2. 删除所有表
# 3. 重新运行迁移
# 4. 加载测试数据（可选）
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

# 数据库配置
DB_CONTAINER="${DB_CONTAINER:-tradecraft-db}"
DB_NAME="${DB_NAME:-tradecraft_dev}"
DB_USER="${DB_USERNAME:-tradecraft}"
BACKUP_DIR="$PROJECT_ROOT/backups/dev"

# 确认重置
confirm_reset() {
    echo ""
    log_warn "========================================="
    log_warn "WARNING: 即将重置开发数据库"
    log_warn "========================================="
    echo "这将："
    echo "  1. 备份当前数据库"
    echo "  2. 删除所有表和数据"
    echo "  3. 重新运行迁移脚本"
    echo ""
    read -p "确认继续？输入 'yes' 确认: " confirm

    if [ "$confirm" != "yes" ]; then
        log_info "重置已取消"
        exit 0
    fi
}

# 备份当前数据库
backup_database() {
    log_step "备份当前数据库..."

    # 创建备份目录
    mkdir -p "$BACKUP_DIR"

    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/backup_before_reset_${timestamp}.sql"

    # 使用 pg_dump 备份
    if docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" > "$backup_file"; then
        log_info "备份成功: $backup_file"

        # 压缩备份
        gzip "$backup_file"
        log_info "备份已压缩: ${backup_file}.gz"
    else
        log_error "备份失败"
        exit 1
    fi
}

# 删除所有表
drop_all_tables() {
    log_step "删除所有表..."

    # SQL脚本：删除所有表
    local drop_sql="
    DO \$\$
    DECLARE
        r RECORD;
    BEGIN
        -- 删除所有表
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;

        -- 删除所有序列
        FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
            EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
        END LOOP;

        -- 删除所有视图
        FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public') LOOP
            EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.viewname) || ' CASCADE';
        END LOOP;

        -- 删除所有函数
        FOR r IN (SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public') LOOP
            EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.routine_name) || ' CASCADE';
        END LOOP;
    END \$\$;
    "

    if docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" <<< "$drop_sql"; then
        log_info "所有表已删除"
    else
        log_error "删除表失败"
        exit 1
    fi
}

# 重新运行初始化脚本
run_init_script() {
    log_step "运行数据库初始化脚本..."

    if [ -f "$PROJECT_ROOT/scripts/database/init-db.sql" ]; then
        if docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$PROJECT_ROOT/scripts/database/init-db.sql"; then
            log_info "初始化脚本执行成功"
        else
            log_error "初始化脚本执行失败"
            exit 1
        fi
    else
        log_warn "初始化脚本不存在，跳过"
    fi
}

# 运行 Flyway 迁移
run_migrations() {
    log_step "运行 Flyway 迁移..."

    cd "$PROJECT_ROOT/backend"

    if [ -f ./mvnw ]; then
        if ./mvnw flyway:migrate; then
            log_info "Flyway 迁移成功"
        else
            log_error "Flyway 迁移失败"
            exit 1
        fi
    else
        log_warn "Maven wrapper 不存在，跳过 Flyway 迁移"
        log_info "请手动运行: cd backend && ./mvnw flyway:migrate"
    fi
}

# 加载测试数据
load_test_data() {
    log_step "加载测试数据..."

    local test_data_file="$PROJECT_ROOT/scripts/database/test-data.sql"

    if [ -f "$test_data_file" ]; then
        if docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$test_data_file"; then
            log_info "测试数据加载成功"
        else
            log_error "测试数据加载失败"
            exit 1
        fi
    else
        log_warn "测试数据文件不存在: $test_data_file"
        log_info "跳过测试数据加载"
    fi
}

# 验证数据库
verify_database() {
    log_step "验证数据库状态..."

    # 检查表数量
    local table_count=$(docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)

    log_info "当前表数量: $table_count"

    if [ "$table_count" -gt 0 ]; then
        # 显示表列表
        echo ""
        log_info "表列表:"
        docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"
    else
        log_warn "数据库中没有表"
    fi
}

# 显示数据库信息
show_database_info() {
    echo ""
    echo "========================================="
    log_info "数据库信息"
    echo "========================================="

    # 连接信息
    echo "数据库名称: $DB_NAME"
    echo "用户名: $DB_USER"
    echo "容器名: $DB_CONTAINER"
    echo ""

    # 表统计
    log_info "表统计:"
    docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT
            schemaname,
            tablename,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename;
    "

    echo ""
    echo "========================================="
}

# 显示使用帮助
show_help() {
    cat << EOF
TradeCraft Development Database Reset Script

Usage: $0 [OPTIONS]

Options:
    -h, --help              显示帮助信息
    --skip-backup           跳过数据库备份
    --skip-test-data        跳过加载测试数据
    --force                 强制重置（不询问确认）

Environment Variables:
    DB_CONTAINER            数据库容器名 (default: tradecraft-db)
    DB_NAME                 数据库名 (default: tradecraft_dev)
    DB_USERNAME             数据库用户 (default: tradecraft)

Examples:
    # 标准重置（包含备份和测试数据）
    $0

    # 快速重置（跳过备份）
    $0 --skip-backup

    # 仅重置表结构（不加载测试数据）
    $0 --skip-test-data

    # 强制重置（不询问）
    $0 --force

EOF
}

# 主函数
main() {
    echo "========================================="
    echo "TradeCraft 开发数据库重置"
    echo "========================================="

    # 检查Docker容器
    if ! docker ps | grep -q "$DB_CONTAINER"; then
        log_error "数据库容器未运行: $DB_CONTAINER"
        log_info "请先启动: docker-compose up -d db"
        exit 1
    fi

    # 确认重置
    if [ "$FORCE" != "true" ]; then
        confirm_reset
    fi

    echo ""

    # 备份数据库
    if [ "$SKIP_BACKUP" != "true" ]; then
        backup_database
        echo ""
    fi

    # 删除所有表
    drop_all_tables
    echo ""

    # 运行初始化脚本
    run_init_script
    echo ""

    # 运行 Flyway 迁移
    run_migrations
    echo ""

    # 加载测试数据
    if [ "$SKIP_TEST_DATA" != "true" ]; then
        load_test_data
        echo ""
    fi

    # 验证数据库
    verify_database

    # 显示数据库信息
    show_database_info

    log_info "========================================="
    log_info "数据库重置完成！"
    log_info "========================================="
}

# 解析命令行参数
SKIP_BACKUP=false
SKIP_TEST_DATA=false
FORCE=false

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
        --skip-test-data)
            SKIP_TEST_DATA=true
            shift
            ;;
        --force)
            FORCE=true
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
