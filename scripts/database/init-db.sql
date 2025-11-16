-- ==========================================
-- TradeCraft 数据库初始化脚本
-- ==========================================
-- 此脚本在PostgreSQL容器首次启动时自动执行
-- 用于创建必要的扩展和初始配置

-- 设置字符集
SET client_encoding = 'UTF8';

-- 创建扩展：UUID支持
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建扩展：JSONB操作符
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- 创建扩展：全文搜索（中文支持）
-- CREATE EXTENSION IF NOT EXISTS "pg_jieba"; -- 需要额外安装

-- 创建扩展：PostGIS（如果需要地理位置功能）
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- ==========================================
-- 创建Schema（可选，用于多租户或模块隔离）
-- ==========================================
-- CREATE SCHEMA IF NOT EXISTS ecommerce;
-- CREATE SCHEMA IF NOT EXISTS analytics;
-- CREATE SCHEMA IF NOT EXISTS audit;

-- ==========================================
-- 创建枚举类型（后续Flyway迁移会使用）
-- ==========================================

-- 用户角色
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'SELLER', 'BUYER');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 用户状态
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 商品状态
DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('DRAFT', 'PUBLISHED', 'OUT_OF_STOCK', 'DISCONTINUED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 订单状态
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'PENDING_PAYMENT',
        'PAID',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 支付状态
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 支付方式
DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('STRIPE', 'PAYPAL', 'COD');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ==========================================
-- 创建通用函数
-- ==========================================

-- 自动更新 updated_at 字段的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 生成唯一SKU的函数
CREATE OR REPLACE FUNCTION generate_sku()
RETURNS TEXT AS $$
BEGIN
    RETURN 'SKU' || LPAD(nextval('product_sku_seq')::TEXT, 10, '0');
END;
$$ LANGUAGE plpgsql;

-- 序列（用于生成SKU）
CREATE SEQUENCE IF NOT EXISTS product_sku_seq START 1000;

-- ==========================================
-- 创建索引优化函数
-- ==========================================

-- 用于全文搜索的tsvector更新函数
CREATE OR REPLACE FUNCTION product_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name_en, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.name_id, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description_en, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.description_id, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 创建审计日志表（可选）
-- ==========================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    record_id BIGINT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by BIGINT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON audit_logs(changed_at DESC);

-- 通用审计触发器函数
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (table_name, operation, record_id, old_data)
        VALUES (TG_TABLE_NAME, TG_OP, OLD.id, row_to_json(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (table_name, operation, record_id, old_data, new_data)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (table_name, operation, record_id, new_data)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 创建性能监控视图
-- ==========================================

-- 慢查询监控（需要启用pg_stat_statements扩展）
CREATE OR REPLACE VIEW slow_queries AS
SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time,
    stddev_time
FROM pg_stat_statements
WHERE mean_time > 100 -- 平均执行时间 > 100ms
ORDER BY mean_time DESC
LIMIT 20;

-- 数据库大小监控
CREATE OR REPLACE VIEW database_size AS
SELECT
    pg_database.datname AS database_name,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
ORDER BY pg_database_size(pg_database.datname) DESC;

-- 表大小监控
CREATE OR REPLACE VIEW table_sizes AS
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ==========================================
-- 初始化完成
-- ==========================================

-- 输出初始化完成信息
DO $$
BEGIN
    RAISE NOTICE 'TradeCraft database initialized successfully!';
    RAISE NOTICE 'Timestamp: %', NOW();
END $$;
