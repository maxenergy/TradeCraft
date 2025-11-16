#!/bin/bash

# ==========================================
# TradeCraft 健康检查脚本
# ==========================================
# 功能：
# 1. 检查所有服务健康状态
# 2. 检查数据库连接
# 3. 检查Redis连接
# 4. 检查外部API可用性
# 5. 生成健康报告
# ==========================================

set -e

# 配置
BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
AI_SERVICE_URL="${AI_SERVICE_URL:-http://localhost:8000}"
TIMEOUT=5

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 健康状态
OVERALL_HEALTHY=true

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

log_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

log_fail() {
    echo -e "${RED}✗${NC} $1"
    OVERALL_HEALTHY=false
}

# 检查HTTP端点
check_http_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"

    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" 2>/dev/null || echo "000")

    if [ "$response" -eq "$expected_status" ]; then
        log_pass "$name: $url (HTTP $response)"
        return 0
    else
        log_fail "$name: $url (HTTP $response, expected $expected_status)"
        return 1
    fi
}

# 检查JSON响应
check_json_endpoint() {
    local name="$1"
    local url="$2"
    local json_path="$3"
    local expected_value="$4"

    local response=$(curl -s --max-time $TIMEOUT "$url" 2>/dev/null)

    if [ -z "$response" ]; then
        log_fail "$name: No response from $url"
        return 1
    fi

    local actual_value=$(echo "$response" | jq -r "$json_path" 2>/dev/null)

    if [ "$actual_value" = "$expected_value" ]; then
        log_pass "$name: $json_path = $expected_value"
        return 0
    else
        log_fail "$name: $json_path = $actual_value (expected $expected_value)"
        return 1
    fi
}

# 检查后端服务
check_backend() {
    echo ""
    log_info "检查后端服务..."

    # 健康端点
    check_http_endpoint "Backend Health" "$BACKEND_URL/actuator/health" 200

    # 详细健康信息
    if curl -s --max-time $TIMEOUT "$BACKEND_URL/actuator/health" 2>/dev/null | jq -e '.status == "UP"' >/dev/null 2>&1; then
        log_pass "Backend status: UP"

        # 检查各组件
        local health_json=$(curl -s --max-time $TIMEOUT "$BACKEND_URL/actuator/health" 2>/dev/null)

        # 数据库健康
        if echo "$health_json" | jq -e '.components.db.status == "UP"' >/dev/null 2>&1; then
            log_pass "Database connection: UP"
        else
            log_fail "Database connection: DOWN"
        fi

        # Redis健康
        if echo "$health_json" | jq -e '.components.redis.status == "UP"' >/dev/null 2>&1; then
            log_pass "Redis connection: UP"
        else
            log_fail "Redis connection: DOWN"
        fi

        # 磁盘空间
        if echo "$health_json" | jq -e '.components.diskSpace.status == "UP"' >/dev/null 2>&1; then
            log_pass "Disk space: UP"
        else
            log_fail "Disk space: DOWN"
        fi
    else
        log_fail "Backend status: DOWN"
    fi

    # API端点测试
    check_http_endpoint "Backend API Docs" "$BACKEND_URL/swagger-ui.html" 200
    check_http_endpoint "Backend Info" "$BACKEND_URL/actuator/info" 200
}

# 检查前端服务
check_frontend() {
    echo ""
    log_info "检查前端服务..."

    # 首页
    check_http_endpoint "Frontend Homepage" "$FRONTEND_URL" 200

    # API健康端点（如果实现了）
    if curl -s --max-time $TIMEOUT "$FRONTEND_URL/api/health" 2>/dev/null >/dev/null; then
        check_json_endpoint "Frontend Health" "$FRONTEND_URL/api/health" ".status" "ok"
    else
        log_warn "Frontend health API not implemented"
    fi

    # 检查静态资源
    if curl -s --max-time $TIMEOUT "$FRONTEND_URL/_next/static" 2>/dev/null | grep -q "404"; then
        log_warn "Frontend static assets may not be properly built"
    else
        log_pass "Frontend static assets available"
    fi
}

# 检查AI服务
check_ai_service() {
    echo ""
    log_info "检查AI服务..."

    # 健康端点
    check_http_endpoint "AI Service Health" "$AI_SERVICE_URL/health" 200

    # 详细健康信息
    if curl -s --max-time $TIMEOUT "$AI_SERVICE_URL/health" 2>/dev/null | jq -e '.status == "healthy"' >/dev/null 2>&1; then
        log_pass "AI Service status: healthy"
    else
        log_fail "AI Service status: unhealthy"
    fi

    # API文档
    check_http_endpoint "AI Service Docs" "$AI_SERVICE_URL/docs" 200
}

# 检查数据库
check_database() {
    echo ""
    log_info "检查数据库..."

    # 检查PostgreSQL容器
    if docker ps | grep -q "postgres"; then
        log_pass "PostgreSQL container running"

        # 检查数据库连接
        if docker exec $(docker ps -qf "name=postgres") pg_isready >/dev/null 2>&1; then
            log_pass "PostgreSQL accepting connections"
        else
            log_fail "PostgreSQL not accepting connections"
        fi

        # 检查数据库大小
        local db_size=$(docker exec $(docker ps -qf "name=postgres") psql -U tradecraft -d tradecraft_prod -t -c "SELECT pg_size_pretty(pg_database_size('tradecraft_prod'));" 2>/dev/null | xargs)
        if [ -n "$db_size" ]; then
            log_pass "Database size: $db_size"
        fi

        # 检查连接数
        local connections=$(docker exec $(docker ps -qf "name=postgres") psql -U tradecraft -d tradecraft_prod -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | xargs)
        if [ -n "$connections" ]; then
            log_pass "Active connections: $connections"
        fi
    else
        log_fail "PostgreSQL container not running"
    fi
}

# 检查Redis
check_redis() {
    echo ""
    log_info "检查Redis..."

    # 检查Redis容器
    if docker ps | grep -q "redis"; then
        log_pass "Redis container running"

        # 检查Redis连接
        if docker exec $(docker ps -qf "name=redis") redis-cli ping 2>/dev/null | grep -q "PONG"; then
            log_pass "Redis responding to PING"
        else
            log_fail "Redis not responding"
        fi

        # 检查内存使用
        local memory_used=$(docker exec $(docker ps -qf "name=redis") redis-cli INFO memory 2>/dev/null | grep "used_memory_human" | cut -d: -f2 | tr -d '\r')
        if [ -n "$memory_used" ]; then
            log_pass "Redis memory usage: $memory_used"
        fi

        # 检查键数量
        local key_count=$(docker exec $(docker ps -qf "name=redis") redis-cli DBSIZE 2>/dev/null | grep -o '[0-9]*')
        if [ -n "$key_count" ]; then
            log_pass "Redis keys: $key_count"
        fi
    else
        log_fail "Redis container not running"
    fi
}

# 检查Docker容器
check_containers() {
    echo ""
    log_info "检查Docker容器状态..."

    local containers=("tradecraft-backend" "tradecraft-frontend" "tradecraft-ai" "tradecraft-db" "tradecraft-redis")

    for container in "${containers[@]}"; do
        if docker ps --format '{{.Names}}' | grep -q "$container"; then
            local status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null)
            local health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null)

            if [ "$status" = "running" ]; then
                if [ "$health" = "healthy" ] || [ "$health" = "<no value>" ]; then
                    log_pass "$container: running"
                else
                    log_warn "$container: running but health=$health"
                fi
            else
                log_fail "$container: $status"
            fi
        else
            log_fail "$container: not found"
        fi
    done
}

# 检查系统资源
check_system_resources() {
    echo ""
    log_info "检查系统资源..."

    # CPU使用率
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    log_info "CPU Usage: ${cpu_usage}%"

    # 内存使用
    local mem_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    log_info "Memory Usage: ${mem_usage}%"

    # 磁盘空间
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    log_info "Disk Usage: ${disk_usage}%"

    # 警告阈值
    if (( $(echo "$cpu_usage > 80" | bc -l) )); then
        log_warn "High CPU usage: ${cpu_usage}%"
    fi

    if (( $(echo "$mem_usage > 80" | bc -l) )); then
        log_warn "High memory usage: ${mem_usage}%"
    fi

    if [ "$disk_usage" -gt 80 ]; then
        log_warn "Low disk space: ${disk_usage}% used"
    fi
}

# 检查日志错误
check_logs_for_errors() {
    echo ""
    log_info "检查最近日志中的错误..."

    local containers=("tradecraft-backend" "tradecraft-frontend" "tradecraft-ai")

    for container in "${containers[@]}"; do
        if docker ps --format '{{.Names}}' | grep -q "$container"; then
            local error_count=$(docker logs --since=5m "$container" 2>&1 | grep -i "error" | wc -l)

            if [ "$error_count" -gt 0 ]; then
                log_warn "$container: $error_count errors in last 5 minutes"
            else
                log_pass "$container: no errors in last 5 minutes"
            fi
        fi
    done
}

# 生成健康报告
generate_report() {
    echo ""
    echo "========================================="
    echo "健康检查报告"
    echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "========================================="

    if $OVERALL_HEALTHY; then
        log_pass "整体状态: 健康"
        exit 0
    else
        log_fail "整体状态: 异常"
        exit 1
    fi
}

# 显示使用帮助
show_help() {
    cat << EOF
TradeCraft Health Check Script

Usage: $0 [OPTIONS]

Options:
    -h, --help              显示帮助信息
    --backend-url URL       后端URL (default: http://localhost:8080)
    --frontend-url URL      前端URL (default: http://localhost:3000)
    --ai-url URL            AI服务URL (default: http://localhost:8000)
    --timeout SECONDS       超时时间 (default: 5)
    --quick                 快速检查（仅检查服务状态）
    --full                  完整检查（包括日志分析）

Examples:
    # 标准健康检查
    $0

    # 快速检查
    $0 --quick

    # 完整检查
    $0 --full

    # 检查生产环境
    $0 --backend-url https://api.tradecraft.com

EOF
}

# 主函数
main() {
    echo "========================================="
    echo "TradeCraft 健康检查"
    echo "========================================="

    check_containers
    check_database
    check_redis
    check_backend
    check_frontend
    check_ai_service
    check_system_resources

    if [ "$CHECK_MODE" = "full" ]; then
        check_logs_for_errors
    fi

    generate_report
}

# 解析命令行参数
CHECK_MODE="standard"

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --backend-url)
            BACKEND_URL="$2"
            shift 2
            ;;
        --frontend-url)
            FRONTEND_URL="$2"
            shift 2
            ;;
        --ai-url)
            AI_SERVICE_URL="$2"
            shift 2
            ;;
        --timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        --quick)
            CHECK_MODE="quick"
            shift
            ;;
        --full)
            CHECK_MODE="full"
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
