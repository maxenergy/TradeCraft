-- V3: Create cart and order tables
-- Description: Creates tables for shopping cart and order management

-- ==========================================
-- Cart Items Table
-- ==========================================
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_snapshot DECIMAL(10, 2) NOT NULL,
    currency_snapshot VARCHAR(3) NOT NULL DEFAULT 'CNY',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_cart_quantity CHECK (quantity > 0),
    CONSTRAINT uq_cart_user_product UNIQUE (user_id, product_id)
);

-- Indexes for cart_items
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_product ON cart_items(product_id);
CREATE INDEX idx_cart_created_at ON cart_items(created_at DESC);

-- ==========================================
-- Orders Table
-- ==========================================
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'CNY',
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,

    -- Shipping Address
    shipping_name VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100),
    shipping_country VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20),

    -- Payment Information
    payment_method VARCHAR(20),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_transaction_id VARCHAR(100),
    paid_at TIMESTAMP,

    -- Tracking Information
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,

    -- Notes and Metadata
    notes TEXT,
    metadata JSONB,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT chk_order_status CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDING', 'REFUNDED')),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    CONSTRAINT chk_payment_method CHECK (payment_method IS NULL OR payment_method IN ('CREDIT_CARD', 'PAYPAL', 'ALIPAY', 'WECHAT_PAY', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'))
);

-- Indexes for orders
CREATE INDEX idx_order_number ON orders(order_number);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_payment_status ON orders(payment_status);
CREATE INDEX idx_order_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_paid_at ON orders(paid_at DESC) WHERE paid_at IS NOT NULL;
CREATE INDEX idx_order_shipped_at ON orders(shipped_at DESC) WHERE shipped_at IS NOT NULL;

-- ==========================================
-- Order Items Table
-- ==========================================
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    price_snapshot DECIMAL(10, 2) NOT NULL,
    product_name_snapshot VARCHAR(500) NOT NULL,
    product_sku_snapshot VARCHAR(50),

    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT chk_order_item_quantity CHECK (quantity > 0)
);

-- Indexes for order_items
CREATE INDEX idx_order_item_order ON order_items(order_id);
CREATE INDEX idx_order_item_product ON order_items(product_id);

-- ==========================================
-- Triggers
-- ==========================================

-- Trigger for cart_items updated_at
CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Comments
-- ==========================================

COMMENT ON TABLE cart_items IS '购物车项表';
COMMENT ON TABLE orders IS '订单表';
COMMENT ON TABLE order_items IS '订单项表';

COMMENT ON COLUMN cart_items.price_snapshot IS '添加到购物车时的价格快照';
COMMENT ON COLUMN cart_items.currency_snapshot IS '添加到购物车时的货币快照';

COMMENT ON COLUMN orders.order_number IS '订单号，格式：ORD-YYYYMMDDHHMMSS-XXXX';
COMMENT ON COLUMN orders.status IS '订单状态：PENDING-待支付, PROCESSING-处理中, SHIPPED-已发货, DELIVERED-已送达, CANCELLED-已取消, REFUNDING-退款中, REFUNDED-已退款';
COMMENT ON COLUMN orders.payment_status IS '支付状态：PENDING-待支付, PAID-已支付, FAILED-失败, REFUNDED-已退款';
COMMENT ON COLUMN orders.payment_method IS '支付方式：CREDIT_CARD-信用卡, PAYPAL-PayPal, ALIPAY-支付宝, WECHAT_PAY-微信支付, BANK_TRANSFER-银行转账, CASH_ON_DELIVERY-货到付款';

COMMENT ON COLUMN order_items.price_snapshot IS '下单时的产品价格快照';
COMMENT ON COLUMN order_items.product_name_snapshot IS '下单时的产品名称快照';
COMMENT ON COLUMN order_items.product_sku_snapshot IS '下单时的产品SKU快照';
