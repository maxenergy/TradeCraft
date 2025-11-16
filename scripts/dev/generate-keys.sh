#!/bin/bash

# ==========================================
# TradeCraft 密钥生成脚本
# ==========================================
# 功能：
# 1. 生成 JWT 密钥
# 2. 生成数据库密码
# 3. 生成 Redis 密码
# 4. 生成 Session Secret
# 5. 更新 .env 文件
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

# 生成随机字符串
generate_random_string() {
    local length="${1:-32}"
    openssl rand -base64 "$length" | tr -d '\n'
}

# 生成字母数字字符串
generate_alphanumeric() {
    local length="${1:-16}"
    LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c "$length"
}

# 生成 JWT 密钥
generate_jwt_secret() {
    log_step "生成 JWT 密钥..."

    # JWT 密钥至少 512 位 (64 字节)
    local jwt_secret=$(generate_random_string 64)

    log_info "✓ JWT 密钥已生成 (512 bits)"
    echo "$jwt_secret"
}

# 生成数据库密码
generate_db_password() {
    log_step "生成数据库密码..."

    local db_password=$(generate_alphanumeric 24)

    log_info "✓ 数据库密码已生成"
    echo "$db_password"
}

# 生成 Redis 密码
generate_redis_password() {
    log_step "生成 Redis 密码..."

    local redis_password=$(generate_alphanumeric 32)

    log_info "✓ Redis 密码已生成"
    echo "$redis_password"
}

# 生成 Session Secret
generate_session_secret() {
    log_step "生成 Session Secret..."

    local session_secret=$(generate_random_string 48)

    log_info "✓ Session Secret 已生成"
    echo "$session_secret"
}

# 生成加密密钥
generate_encryption_key() {
    log_step "生成数据加密密钥..."

    # AES-256 需要 32 字节
    local encryption_key=$(generate_random_string 32)

    log_info "✓ 加密密钥已生成 (256 bits)"
    echo "$encryption_key"
}

# 更新 .env 文件
update_env_file() {
    local jwt_secret="$1"
    local db_password="$2"
    local redis_password="$3"
    local session_secret="$4"
    local encryption_key="$5"

    log_step "更新 .env 文件..."

    cd "$PROJECT_ROOT"

    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            log_info "从 .env.example 创建 .env 文件"
        else
            log_error ".env 和 .env.example 都不存在"
            exit 1
        fi
    fi

    # 备份原文件
    cp .env .env.backup
    log_info "已备份原文件到 .env.backup"

    # 更新 JWT 密钥
    if grep -q "JWT_SECRET=" .env; then
        sed -i.tmp "s|JWT_SECRET=.*|JWT_SECRET=${jwt_secret}|" .env
    else
        echo "JWT_SECRET=${jwt_secret}" >> .env
    fi

    # 更新数据库密码
    if grep -q "DB_PASSWORD=" .env; then
        sed -i.tmp "s|DB_PASSWORD=.*|DB_PASSWORD=${db_password}|" .env
    else
        echo "DB_PASSWORD=${db_password}" >> .env
    fi

    # 更新 Redis 密码
    if grep -q "REDIS_PASSWORD=" .env; then
        sed -i.tmp "s|REDIS_PASSWORD=.*|REDIS_PASSWORD=${redis_password}|" .env
    else
        echo "REDIS_PASSWORD=${redis_password}" >> .env
    fi

    # 更新 Session Secret
    if grep -q "SESSION_SECRET=" .env; then
        sed -i.tmp "s|SESSION_SECRET=.*|SESSION_SECRET=${session_secret}|" .env
    else
        echo "SESSION_SECRET=${session_secret}" >> .env
    fi

    # 更新加密密钥
    if grep -q "ENCRYPTION_KEY=" .env; then
        sed -i.tmp "s|ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${encryption_key}|" .env
    else
        echo "ENCRYPTION_KEY=${encryption_key}" >> .env
    fi

    # 清理临时文件
    rm -f .env.tmp

    log_info "✓ .env 文件已更新"
}

# 显示生成的密钥
display_keys() {
    local jwt_secret="$1"
    local db_password="$2"
    local redis_password="$3"
    local session_secret="$4"
    local encryption_key="$5"

    echo ""
    echo "========================================="
    log_info "生成的密钥"
    echo "========================================="
    echo ""
    echo "JWT_SECRET:"
    echo "$jwt_secret"
    echo ""
    echo "DB_PASSWORD:"
    echo "$db_password"
    echo ""
    echo "REDIS_PASSWORD:"
    echo "$redis_password"
    echo ""
    echo "SESSION_SECRET:"
    echo "$session_secret"
    echo ""
    echo "ENCRYPTION_KEY:"
    echo "$encryption_key"
    echo ""
    echo "========================================="
    echo ""
    log_warn "请妥善保管这些密钥！"
    log_warn "建议将 .env 文件添加到 .gitignore"
    echo ""
}

# 生成生产环境密钥文件
generate_production_keys() {
    log_step "生成生产环境密钥文件..."

    local prod_env_file="$PROJECT_ROOT/.env.production.local"

    cat > "$prod_env_file" << EOF
# ==========================================
# TradeCraft 生产环境密钥
# 生成时间: $(date '+%Y-%m-%d %H:%M:%S')
# ==========================================
# WARNING: 这些是生产环境密钥，请妥善保管！
# DO NOT COMMIT THIS FILE TO VERSION CONTROL!
# ==========================================

# JWT 配置
JWT_SECRET=$(generate_random_string 64)
JWT_EXPIRATION=86400000

# 数据库配置
DB_PASSWORD=$(generate_alphanumeric 32)

# Redis 配置
REDIS_PASSWORD=$(generate_alphanumeric 32)

# Session 配置
SESSION_SECRET=$(generate_random_string 48)

# 加密配置
ENCRYPTION_KEY=$(generate_random_string 32)

# Cookie 配置
COOKIE_SECRET=$(generate_random_string 32)

# CSRF 配置
CSRF_SECRET=$(generate_random_string 32)

# ==========================================
# 其他生产环境配置
# ==========================================

# 环境
NODE_ENV=production
SPRING_PROFILES_ACTIVE=prod

# 域名
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
AI_SERVICE_URL=https://ai.yourdomain.com

# CORS
CORS_ORIGIN=https://yourdomain.com

# 安全
SECURE_COOKIES=true
HTTPS_ONLY=true

EOF

    chmod 600 "$prod_env_file"
    log_info "✓ 生产环境密钥文件已创建: $prod_env_file"
    log_warn "文件权限已设置为 600 (仅所有者可读写)"
}

# 验证密钥强度
validate_key_strength() {
    local key="$1"
    local min_length="$2"
    local key_name="$3"

    local length=${#key}

    if [ "$length" -lt "$min_length" ]; then
        log_warn "$key_name 长度不足 (${length} < ${min_length})"
        return 1
    else
        log_info "✓ $key_name 长度足够 ($length 字符)"
        return 0
    fi
}

# 显示使用帮助
show_help() {
    cat << EOF
TradeCraft Key Generation Script

Usage: $0 [OPTIONS]

Options:
    -h, --help              显示帮助信息
    --jwt-only              仅生成 JWT 密钥
    --db-only               仅生成数据库密码
    --redis-only            仅生成 Redis 密码
    --production            生成生产环境密钥文件
    --no-update             不更新 .env 文件
    --display-only          仅显示密钥，不保存

Examples:
    # 生成所有密钥并更新 .env
    $0

    # 仅生成 JWT 密钥
    $0 --jwt-only

    # 生成生产环境密钥
    $0 --production

    # 生成但不保存
    $0 --display-only

EOF
}

# 主函数
main() {
    echo "========================================="
    echo "TradeCraft 密钥生成工具"
    echo "========================================="
    echo ""

    # 检查 openssl
    if ! command -v openssl >/dev/null 2>&1; then
        log_error "OpenSSL not found. Please install OpenSSL"
        exit 1
    fi

    # 生成密钥
    if [ "$JWT_ONLY" = "true" ]; then
        local jwt_secret=$(generate_jwt_secret)
        echo "$jwt_secret"
        exit 0
    elif [ "$DB_ONLY" = "true" ]; then
        local db_password=$(generate_db_password)
        echo "$db_password"
        exit 0
    elif [ "$REDIS_ONLY" = "true" ]; then
        local redis_password=$(generate_redis_password)
        echo "$redis_password"
        exit 0
    elif [ "$PRODUCTION" = "true" ]; then
        generate_production_keys
        exit 0
    else
        # 生成所有密钥
        local jwt_secret=$(generate_jwt_secret)
        echo ""
        local db_password=$(generate_db_password)
        echo ""
        local redis_password=$(generate_redis_password)
        echo ""
        local session_secret=$(generate_session_secret)
        echo ""
        local encryption_key=$(generate_encryption_key)
        echo ""

        # 验证密钥强度
        log_step "验证密钥强度..."
        validate_key_strength "$jwt_secret" 64 "JWT Secret"
        validate_key_strength "$db_password" 16 "DB Password"
        validate_key_strength "$redis_password" 16 "Redis Password"
        validate_key_strength "$session_secret" 32 "Session Secret"
        validate_key_strength "$encryption_key" 32 "Encryption Key"

        # 显示密钥
        if [ "$DISPLAY_ONLY" = "true" ]; then
            display_keys "$jwt_secret" "$db_password" "$redis_password" "$session_secret" "$encryption_key"
        else
            # 更新 .env 文件
            if [ "$NO_UPDATE" != "true" ]; then
                echo ""
                update_env_file "$jwt_secret" "$db_password" "$redis_password" "$session_secret" "$encryption_key"
                echo ""
                log_info "========================================="
                log_info "密钥生成并更新完成！"
                log_info "========================================="
            else
                display_keys "$jwt_secret" "$db_password" "$redis_password" "$session_secret" "$encryption_key"
            fi
        fi
    fi
}

# 解析命令行参数
JWT_ONLY=false
DB_ONLY=false
REDIS_ONLY=false
PRODUCTION=false
NO_UPDATE=false
DISPLAY_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --jwt-only)
            JWT_ONLY=true
            shift
            ;;
        --db-only)
            DB_ONLY=true
            shift
            ;;
        --redis-only)
            REDIS_ONLY=true
            shift
            ;;
        --production)
            PRODUCTION=true
            shift
            ;;
        --no-update)
            NO_UPDATE=true
            shift
            ;;
        --display-only)
            DISPLAY_ONLY=true
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
