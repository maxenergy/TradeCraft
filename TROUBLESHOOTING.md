# TradeCraft 故障排查指南

本文档提供了TradeCraft项目常见问题的解决方案。

## 目录

- [环境配置问题](#环境配置问题)
- [数据库问题](#数据库问题)
- [后端问题](#后端问题)
- [前端问题](#前端问题)
- [AI服务问题](#ai服务问题)
- [Docker问题](#docker问题)
- [部署问题](#部署问题)
- [性能问题](#性能问题)

---

## 环境配置问题

### 问题：Java版本不正确

**症状**：
```bash
Error: A JNI error has occurred
Unsupported class file major version 61
```

**原因**：项目需要Java 17，但系统使用了较低版本

**解决方案**：
```bash
# 检查Java版本
java -version

# 安装Java 17（Ubuntu/Debian）
sudo apt update
sudo apt install openjdk-17-jdk

# 设置默认Java版本
sudo update-alternatives --config java

# 验证
java -version  # 应显示 17.x.x
```

### 问题：Node.js版本过低

**症状**：
```
error engine Unsupported engine
```

**解决方案**：
```bash
# 使用nvm安装Node 18
nvm install 18
nvm use 18

# 或直接下载安装
# https://nodejs.org/

# 验证
node -v  # 应显示 v18.x.x
```

### 问题：.env文件未配置

**症状**：
```
Cannot read properties of undefined (reading 'JWT_SECRET')
```

**解决方案**：
```bash
# 复制示例文件
cp .env.example .env

# 生成密钥
./scripts/dev/generate-keys.sh

# 编辑 .env 文件，填入必要的API密钥
vim .env
```

---

## 数据库问题

### 问题：数据库连接失败

**症状**：
```
org.postgresql.util.PSQLException: Connection refused
```

**原因**：PostgreSQL未启动或连接配置错误

**解决方案**：
```bash
# 检查PostgreSQL容器
docker-compose ps

# 如果未运行，启动数据库
docker-compose up -d db

# 检查连接配置
cat .env | grep DB_

# 测试连接
docker exec -it tradecraft-db psql -U tradecraft -d tradecraft_dev
```

### 问题：Flyway迁移失败

**症状**：
```
FlywayException: Validate failed: Migration checksum mismatch
```

**解决方案**：

**选项1：清理并重新迁移（仅开发环境）**
```bash
cd backend
./mvnw flyway:clean
./mvnw flyway:migrate
```

**选项2：修复特定迁移**
```bash
# 查看迁移状态
./mvnw flyway:info

# 修复失败的迁移
./mvnw flyway:repair
```

**选项3：重置数据库（仅开发环境）**
```bash
./scripts/dev/reset-db.sh
```

### 问题：数据库权限错误

**症状**：
```
ERROR: permission denied for table products
```

**解决方案**：
```sql
-- 连接到数据库
docker exec -it tradecraft-db psql -U tradecraft -d tradecraft_dev

-- 授予权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tradecraft;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tradecraft;

-- 设置默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO tradecraft;
```

### 问题：数据库磁盘空间不足

**症状**：
```
ERROR: could not extend file: No space left on device
```

**解决方案**：
```bash
# 检查磁盘使用
df -h

# 清理未使用的Docker资源
docker system prune -a

# 清理数据库日志
docker exec tradecraft-db sh -c "find /var/lib/postgresql/data/log -type f -mtime +7 -delete"

# 如果是生产环境，执行VACUUM
docker exec -it tradecraft-db psql -U tradecraft -d tradecraft_prod -c "VACUUM FULL;"
```

---

## 后端问题

### 问题：Spring Boot启动失败

**症状**：
```
APPLICATION FAILED TO START
```

**排查步骤**：

1. **检查端口占用**
```bash
# 检查8080端口
lsof -i :8080
# 或
netstat -tuln | grep 8080

# 如果被占用，杀死进程或更改端口
kill -9 <PID>
```

2. **检查依赖**
```bash
cd backend
./mvnw dependency:tree | grep ERROR
```

3. **清理并重新构建**
```bash
./mvnw clean install -U
```

### 问题：JWT验证失败

**症状**：
```
io.jsonwebtoken.security.WeakKeyException: The signing key's size is 128 bits which is not secure enough
```

**解决方案**：
```bash
# JWT密钥必须至少512位
./scripts/dev/generate-keys.sh --jwt-only

# 复制生成的密钥到 .env 文件
# JWT_SECRET=<生成的密钥>

# 重启后端服务
```

### 问题：Redis连接失败

**症状**：
```
Unable to connect to Redis; nested exception is io.lettuce.core.RedisConnectionException
```

**解决方案**：
```bash
# 检查Redis容器
docker-compose ps redis

# 启动Redis
docker-compose up -d redis

# 测试连接
docker exec -it tradecraft-redis redis-cli
> AUTH <your-redis-password>
> PING
# 应返回 PONG

# 检查 .env 配置
cat .env | grep REDIS_
```

### 问题：文件上传失败

**症状**：
```
Maximum upload size exceeded
```

**解决方案**：

在 `application.yml` 中增加上传大小限制：
```yaml
spring:
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB
```

### 问题：跨域CORS错误

**症状**：
```
Access to fetch at 'http://localhost:8080/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**解决方案**：

检查 `CorsConfig.java`：
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            System.getenv("FRONTEND_URL")
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

---

## 前端问题

### 问题：Next.js开发服务器无法启动

**症状**：
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案**：
```bash
# 查找占用3000端口的进程
lsof -ti:3000

# 杀死进程
kill -9 $(lsof -ti:3000)

# 或使用其他端口
PORT=3001 npm run dev
```

### 问题：页面白屏

**排查步骤**：

1. **检查浏览器控制台**
   - 打开开发者工具 (F12)
   - 查看Console和Network标签页

2. **检查API连接**
```javascript
// 在浏览器控制台执行
fetch('http://localhost:8080/api/v1/products')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

3. **检查环境变量**
```bash
# 确保 .env.local 正确配置
cat frontend/.env.local

# 必须包含
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. **清除缓存并重启**
```bash
cd frontend
rm -rf .next
npm run dev
```

### 问题：TypeScript类型错误

**症状**：
```
Type 'X' is not assignable to type 'Y'
```

**解决方案**：
```bash
# 重新生成类型
cd frontend
npm run type-check

# 如果使用OpenAPI生成
npm run generate-api-types

# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题：图片加载失败

**症状**：
```
Error: Invalid src prop
```

**解决方案**：

在 `next.config.js` 添加图片域名：
```javascript
module.exports = {
  images: {
    domains: [
      'localhost',
      'example.com',
      'your-oss-domain.aliyuncs.com'
    ],
  },
}
```

---

## AI服务问题

### 问题：AI服务启动失败

**症状**：
```
ModuleNotFoundError: No module named 'fastapi'
```

**解决方案**：
```bash
cd ai-service

# 激活虚拟环境
source venv/bin/activate

# 重新安装依赖
pip install -r requirements.txt

# 验证安装
pip list | grep fastapi
```

### 问题：API密钥无效

**症状**：
```
HTTPException: Invalid API key
```

**解决方案**：
```bash
# 检查 .env 配置
cat .env | grep -E "(WENXIN|GLM|AZURE)"

# 确保API密钥正确配置
# WENXIN_API_KEY=your-key-here
# GLM_API_KEY=your-key-here
# AZURE_TRANSLATOR_KEY=your-key-here
```

### 问题：Celery任务未执行

**症状**：任务提交后没有响应

**解决方案**：
```bash
# 检查Celery worker是否运行
ps aux | grep celery

# 启动Celery worker
cd ai-service
source venv/bin/activate
celery -A celery_app worker --loglevel=info

# 检查Redis连接
python -c "import redis; r = redis.Redis(host='localhost', port=6379, password='your-password'); print(r.ping())"
```

### 问题：内容生成超时

**症状**：
```
TimeoutError: Request timeout
```

**解决方案**：

增加超时时间：
```python
# main.py
from fastapi import FastAPI
import httpx

app = FastAPI()

# 创建HTTP客户端时设置超时
async def generate_content():
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(...)
```

---

## Docker问题

### 问题：Docker容器无法启动

**症状**：
```
Error response from daemon: Container is not running
```

**排查步骤**：
```bash
# 查看容器日志
docker-compose logs <service-name>

# 查看所有容器状态
docker-compose ps

# 重新创建容器
docker-compose up -d --force-recreate <service-name>

# 如果问题持续，完全重置
docker-compose down -v
docker-compose up -d
```

### 问题：镜像构建失败

**症状**：
```
ERROR: failed to solve: process "/bin/sh -c..." did not complete successfully
```

**解决方案**：
```bash
# 清理Docker缓存
docker builder prune -a

# 无缓存重新构建
docker-compose build --no-cache

# 检查磁盘空间
df -h
docker system df
```

### 问题：网络连接问题

**症状**：容器之间无法通信

**解决方案**：
```bash
# 检查网络
docker network ls
docker network inspect tradecraft-network

# 重新创建网络
docker-compose down
docker network prune
docker-compose up -d

# 测试容器间连接
docker exec tradecraft-backend ping tradecraft-db
```

### 问题：卷（Volume）权限问题

**症状**：
```
Permission denied
```

**解决方案**：
```bash
# 修改卷权限
docker-compose down
sudo chown -R $USER:$USER ./data

# 或在Dockerfile中设置正确的用户
# USER tradecraft
```

---

## 部署问题

### 问题：生产环境部署失败

**排查步骤**：

1. **检查环境变量**
```bash
# 确保所有生产环境变量已配置
cat .env | grep -v "^#" | grep -v "^$"
```

2. **检查SSL证书**
```bash
# 验证证书
openssl x509 -in /path/to/cert.pem -text -noout

# 检查证书过期时间
openssl x509 -in /path/to/cert.pem -noout -dates
```

3. **检查防火墙**
```bash
# Ubuntu/Debian
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# CentOS/RHEL
sudo firewall-cmd --list-all
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent
sudo firewall-cmd --reload
```

### 问题：Nginx配置错误

**症状**：
```
nginx: [emerg] unknown directive
```

**解决方案**：
```bash
# 测试Nginx配置
docker exec tradecraft-nginx nginx -t

# 查看详细错误
docker logs tradecraft-nginx

# 重新加载配置
docker exec tradecraft-nginx nginx -s reload
```

### 问题：健康检查失败

**症状**：容器不断重启

**解决方案**：
```bash
# 检查健康检查配置
docker inspect tradecraft-backend | grep -A 10 "Health"

# 手动执行健康检查
docker exec tradecraft-backend curl -f http://localhost:8080/actuator/health

# 临时禁用健康检查进行调试
# 在docker-compose.yml中注释掉healthcheck部分
```

---

## 性能问题

### 问题：数据库查询慢

**诊断**：
```sql
-- 查看慢查询
SELECT * FROM slow_queries LIMIT 10;

-- 分析查询计划
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = 1;

-- 检查缺失的索引
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
AND tablename = 'products';
```

**解决方案**：
```sql
-- 创建索引
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- 更新统计信息
ANALYZE products;
```

### 问题：内存使用过高

**诊断**：
```bash
# 检查容器内存使用
docker stats

# 检查JVM内存
docker exec tradecraft-backend jmap -heap 1
```

**解决方案**：

调整JVM参数：
```yaml
# docker-compose.yml
services:
  backend:
    environment:
      JAVA_OPTS: "-Xms512m -Xmx1g -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

调整容器资源限制：
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 512M
```

### 问题：Redis内存溢出

**症状**：
```
OOM command not allowed when used memory > 'maxmemory'
```

**解决方案**：
```bash
# 检查Redis内存使用
docker exec tradecraft-redis redis-cli INFO memory

# 设置最大内存和淘汰策略
docker exec tradecraft-redis redis-cli CONFIG SET maxmemory 512mb
docker exec tradecraft-redis redis-cli CONFIG SET maxmemory-policy allkeys-lru

# 或在docker-compose.yml中配置
# command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

---

## 获取帮助

如果以上方案无法解决您的问题：

1. **查看日志**
   ```bash
   # 所有服务日志
   docker-compose logs -f

   # 特定服务日志
   docker-compose logs -f backend
   ```

2. **检查GitHub Issues**
   - 搜索类似问题：https://github.com/yourusername/tradecraft/issues

3. **提交Issue**
   - 使用bug报告模板
   - 包含完整的错误信息和日志
   - 说明重现步骤

4. **联系团队**
   - Email: support@tradecraft.com
   - Slack: #tradecraft-support

---

## 常用命令参考

```bash
# 开发环境一键设置
./scripts/dev/setup-local.sh

# 重置数据库
./scripts/dev/reset-db.sh

# 生成密钥
./scripts/dev/generate-keys.sh

# 生产部署
./scripts/deployment/deploy.sh

# 健康检查
./scripts/deployment/health-check.sh

# 回滚
./scripts/deployment/rollback.sh --quick

# 查看所有Docker容器
docker-compose ps

# 查看日志
docker-compose logs -f [service-name]

# 重启服务
docker-compose restart [service-name]

# 进入容器
docker exec -it tradecraft-backend bash
```
