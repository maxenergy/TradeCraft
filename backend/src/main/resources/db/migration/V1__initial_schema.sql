-- ==========================================
-- TradeCraft Initial Database Schema
-- Version: V1
-- Description: Create initial tables for users, categories, products, carts, and orders
-- ==========================================

-- ==========================================
-- Extensions
-- ==========================================

-- UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- JSONB operators
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- ==========================================
-- Enum Types
-- ==========================================

-- User role
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

-- User status
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- Product status
CREATE TYPE product_status AS ENUM ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK');

-- Order status
CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- Payment status
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- Payment method
CREATE TYPE payment_method AS ENUM ('STRIPE', 'PAYPAL', 'COD');

-- ==========================================
-- Users Table
-- ==========================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'USER',
    status user_status NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ==========================================
-- Categories Table
-- ==========================================

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name_zh_cn VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    name_id VARCHAR(200) NOT NULL,
    description_zh_cn TEXT,
    description_en TEXT,
    description_id TEXT,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort ON categories(sort_order);

-- ==========================================
-- Products Table
-- ==========================================

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    sku VARCHAR(50) UNIQUE NOT NULL,

    -- Multilingual names
    name_zh_cn VARCHAR(500) NOT NULL,
    name_en VARCHAR(500) NOT NULL,
    name_id VARCHAR(500) NOT NULL,

    -- Multilingual descriptions
    description_zh_cn TEXT,
    description_en TEXT,
    description_id TEXT,

    -- Multilingual features (JSONB array)
    features_zh_cn JSONB,
    features_en JSONB,
    features_id JSONB,

    -- Pricing (multiple currencies)
    price_cny DECIMAL(10, 2) NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL,
    price_idr DECIMAL(15, 2) NOT NULL,
    price_myr DECIMAL(10, 2) NOT NULL,

    cost_cny DECIMAL(10, 2),

    -- Inventory
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    weight_grams INTEGER,

    -- Status
    status product_status NOT NULL DEFAULT 'ACTIVE',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,

    -- Media and metadata (JSONB)
    images JSONB,
    tags JSONB,

    -- SEO
    seo_title VARCHAR(200),
    seo_description TEXT,
    seo_keywords VARCHAR(500),

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_price_cny ON products(price_cny);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_products_name_zh_cn ON products USING gin(to_tsvector('chinese', name_zh_cn));
CREATE INDEX idx_products_name_en ON products USING gin(to_tsvector('english', name_en));

-- JSONB indexes
CREATE INDEX idx_products_tags ON products USING gin(tags);

-- ==========================================
-- Carts Table
-- ==========================================

CREATE TABLE carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_carts_user ON carts(user_id);

-- ==========================================
-- Cart Items Table
-- ==========================================

CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),

    -- Price snapshot at time of adding to cart
    price_snapshot_cny DECIMAL(10, 2),
    price_snapshot_usd DECIMAL(10, 2),
    price_snapshot_idr DECIMAL(15, 2),
    price_snapshot_myr DECIMAL(10, 2),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(cart_id, product_id)
);

-- Indexes
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- ==========================================
-- Orders Table
-- ==========================================

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    order_number VARCHAR(50) UNIQUE NOT NULL,

    -- Status
    status order_status NOT NULL DEFAULT 'PENDING',
    payment_method payment_method NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'PENDING',

    -- Pricing
    currency VARCHAR(3) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    shipping_fee DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tax DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total DECIMAL(15, 2) NOT NULL,

    -- Shipping address
    shipping_first_name VARCHAR(100) NOT NULL,
    shipping_last_name VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_address_line1 VARCHAR(255) NOT NULL,
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100),
    shipping_country VARCHAR(2) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,

    -- Billing address (if different from shipping)
    billing_address JSONB,

    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,

    -- Tracking
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),

    -- Payment
    payment_intent_id VARCHAR(255),
    payment_details JSONB,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ==========================================
-- Order Items Table
-- ==========================================

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,

    -- Product snapshot
    product_sku VARCHAR(50) NOT NULL,
    product_name VARCHAR(500) NOT NULL,

    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(15, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ==========================================
-- Triggers
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Comments
-- ==========================================

COMMENT ON TABLE users IS 'User accounts and authentication';
COMMENT ON TABLE categories IS 'Product categories with multilingual support';
COMMENT ON TABLE products IS 'Products catalog with multilingual content';
COMMENT ON TABLE carts IS 'Shopping carts for users';
COMMENT ON TABLE cart_items IS 'Items in shopping carts';
COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON TABLE order_items IS 'Line items in orders';

-- ==========================================
-- Initial Data (Optional)
-- ==========================================

-- Create default admin user (password: Admin123!)
-- BCrypt hash of "Admin123!"
INSERT INTO users (email, password, first_name, last_name, role, status, email_verified)
VALUES ('admin@tradecraft.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1JzJQogNrJ0l3p5yQ9eJ5ATNX7dF3E6',
        'System', 'Administrator', 'ADMIN', 'ACTIVE', TRUE);

-- Create root category
INSERT INTO categories (name_zh_cn, name_en, name_id, sort_order)
VALUES ('全部分类', 'All Categories', 'Semua Kategori', 0);
