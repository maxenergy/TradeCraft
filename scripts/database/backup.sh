#!/bin/bash

# ==========================================
# TradeCraft 数据库备份脚本
# ==========================================
# 功能：
# 1. 创建PostgreSQL数据库备份
# 2. 压缩备份文件
# 3. 保留最近30天的备份
# 4. 可选：上传到云存储
# ==========================================

set -e

# 配置
BACKUP_DIR="${BACKUP_DIR:-/home/tradecraft/backups}"
DB_CONTAINER="${DB_CONTAINER:-tradecraft-db}"
DB_NAME="${DB_NAME:-tradecraft_prod}"
DB_USER="${DB_USER:-tradecraft}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# 检查Docker容器是否运行
check_container() {
    if ! docker ps | grep -q "$DB_CONTAINER"; then
        log_error "Database container '$DB_CONTAINER' is not running"
        exit 1
    fi
    log_info "Database container is running"
}

# 创建备份目录
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Created backup directory: $BACKUP_DIR"
    fi
}

# 执行备份
perform_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/backup_${DB_NAME}_${timestamp}.sql"
    local compressed_file="${backup_file}.gz"

    log_info "Starting backup..."
    log_info "Backup file: $backup_file"

    # 使用pg_dump创建备份
    if docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" > "$backup_file"; then
        log_info "Backup created successfully"
    else
        log_error "Backup failed"
        exit 1
    fi

    # 压缩备份文件
    log_info "Compressing backup..."
    if gzip "$backup_file"; then
        log_info "Backup compressed: $compressed_file"

        # 显示文件大小
        local file_size=$(du -h "$compressed_file" | cut -f1)
        log_info "Backup size: $file_size"
    else
        log_error "Compression failed"
        exit 1
    fi

    echo "$compressed_file"
}

# 验证备份
verify_backup() {
    local backup_file="$1"

    log_info "Verifying backup integrity..."

    if gunzip -t "$backup_file" 2>/dev/null; then
        log_info "Backup file is valid"
        return 0
    else
        log_error "Backup file is corrupted"
        return 1
    fi
}

# 清理旧备份
cleanup_old_backups() {
    log_info "Cleaning up backups older than $RETENTION_DAYS days..."

    local deleted_count=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)

    if [ "$deleted_count" -gt 0 ]; then
        log_info "Deleted $deleted_count old backup(s)"
    else
        log_info "No old backups to delete"
    fi
}

# 上传到阿里云OSS（可选）
upload_to_oss() {
    local backup_file="$1"

    # 检查是否配置了OSS
    if [ -z "$OSS_BUCKET" ]; then
        log_warn "OSS_BUCKET not configured, skipping upload"
        return 0
    fi

    log_info "Uploading to Aliyun OSS..."

    # 使用ossutil上传
    if command -v ossutil >/dev/null 2>&1; then
        local oss_path="oss://$OSS_BUCKET/backups/$(basename $backup_file)"

        if ossutil cp "$backup_file" "$oss_path"; then
            log_info "Uploaded to OSS: $oss_path"
        else
            log_error "OSS upload failed"
            return 1
        fi
    else
        log_warn "ossutil not found, skipping OSS upload"
        log_warn "Install: https://help.aliyun.com/document_detail/120075.html"
    fi
}

# 发送通知（可选）
send_notification() {
    local status="$1"
    local message="$2"

    # 通过钉钉/Slack/邮件发送通知
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"[TradeCraft] Database Backup $status: $message\"}" \
            >/dev/null 2>&1
    fi
}

# 显示备份列表
list_backups() {
    log_info "Recent backups:"
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime -7 -exec ls -lh {} \; | \
        awk '{print $9, "(" $5 ")"}'
}

# 主函数
main() {
    log_info "========================================="
    log_info "TradeCraft Database Backup Started"
    log_info "========================================="

    # 检查环境
    check_container
    create_backup_dir

    # 执行备份
    local backup_file
    backup_file=$(perform_backup)

    # 验证备份
    if verify_backup "$backup_file"; then
        # 清理旧备份
        cleanup_old_backups

        # 上传到OSS（可选）
        upload_to_oss "$backup_file"

        # 显示备份列表
        list_backups

        log_info "========================================="
        log_info "Backup completed successfully!"
        log_info "========================================="

        send_notification "SUCCESS" "Backup completed"
        exit 0
    else
        log_error "========================================="
        log_error "Backup failed!"
        log_error "========================================="

        send_notification "FAILED" "Backup verification failed"
        exit 1
    fi
}

# 显示使用帮助
show_help() {
    cat << EOF
TradeCraft Database Backup Script

Usage: $0 [OPTIONS]

Options:
    -h, --help              Show this help message
    -d, --dir DIR           Backup directory (default: /home/tradecraft/backups)
    -r, --retention DAYS    Retention period in days (default: 30)
    -l, --list              List recent backups

Environment Variables:
    DB_CONTAINER            Database container name (default: tradecraft-db)
    DB_NAME                 Database name (default: tradecraft_prod)
    DB_USER                 Database user (default: tradecraft)
    OSS_BUCKET              Aliyun OSS bucket for remote backup
    WEBHOOK_URL             Webhook URL for notifications

Examples:
    # Basic backup
    $0

    # Backup with custom directory
    $0 --dir /mnt/backups

    # Backup with 60 days retention
    $0 --retention 60

    # List recent backups
    $0 --list

Cron Example:
    # Daily backup at 2 AM
    0 2 * * * /home/tradecraft/scripts/database/backup.sh >> /var/log/tradecraft-backup.log 2>&1

EOF
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -d|--dir)
            BACKUP_DIR="$2"
            shift 2
            ;;
        -r|--retention)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        -l|--list)
            create_backup_dir
            list_backups
            exit 0
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
