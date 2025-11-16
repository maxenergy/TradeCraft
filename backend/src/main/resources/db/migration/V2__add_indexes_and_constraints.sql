-- ==========================================
-- TradeCraft Database Migration V2
-- Description: Add additional indexes and constraints for performance optimization
-- ==========================================

-- ==========================================
-- Performance Indexes
-- ==========================================

-- Products: compound indexes for common queries
CREATE INDEX idx_products_category_status ON products(category_id, status);
CREATE INDEX idx_products_status_created ON products(status, created_at DESC);
CREATE INDEX idx_products_featured_status ON products(is_featured, status) WHERE is_featured = TRUE;

-- Orders: compound indexes for common queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);
CREATE INDEX idx_orders_payment_status_method ON orders(payment_status, payment_method);

-- Order items: for reporting
CREATE INDEX idx_order_items_product_created ON order_items(product_id, created_at);

-- ==========================================
-- Constraints
-- ==========================================

-- Ensure stock quantity is non-negative
ALTER TABLE products ADD CONSTRAINT check_stock_non_negative
    CHECK (stock_quantity >= 0);

-- Ensure prices are positive
ALTER TABLE products ADD CONSTRAINT check_price_cny_positive
    CHECK (price_cny > 0);
ALTER TABLE products ADD CONSTRAINT check_price_usd_positive
    CHECK (price_usd > 0);
ALTER TABLE products ADD CONSTRAINT check_price_idr_positive
    CHECK (price_idr > 0);
ALTER TABLE products ADD CONSTRAINT check_price_myr_positive
    CHECK (price_myr > 0);

-- Ensure order totals are non-negative
ALTER TABLE orders ADD CONSTRAINT check_subtotal_non_negative
    CHECK (subtotal >= 0);
ALTER TABLE orders ADD CONSTRAINT check_shipping_non_negative
    CHECK (shipping_fee >= 0);
ALTER TABLE orders ADD CONSTRAINT check_tax_non_negative
    CHECK (tax >= 0);
ALTER TABLE orders ADD CONSTRAINT check_total_positive
    CHECK (total > 0);

-- Ensure order item prices are positive
ALTER TABLE order_items ADD CONSTRAINT check_unit_price_positive
    CHECK (unit_price > 0);
ALTER TABLE order_items ADD CONSTRAINT check_total_price_positive
    CHECK (total_price > 0);

-- ==========================================
-- Additional Validation
-- ==========================================

-- Email format validation (basic)
ALTER TABLE users ADD CONSTRAINT check_email_format
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Phone format validation (allows international format)
ALTER TABLE users ADD CONSTRAINT check_phone_format
    CHECK (phone IS NULL OR phone ~* '^\+?[0-9\s\-\(\)]+$');

-- SKU format validation (uppercase letters, numbers, hyphens)
ALTER TABLE products ADD CONSTRAINT check_sku_format
    CHECK (sku ~* '^[A-Z0-9\-]+$');

-- Order number format validation
ALTER TABLE orders ADD CONSTRAINT check_order_number_format
    CHECK (order_number ~* '^ORD-[0-9]{4}-[0-9]+$');

-- Currency code validation (ISO 4217)
ALTER TABLE orders ADD CONSTRAINT check_currency_code
    CHECK (currency IN ('CNY', 'USD', 'IDR', 'MYR'));

-- Country code validation (ISO 3166-1 alpha-2)
ALTER TABLE orders ADD CONSTRAINT check_country_code
    CHECK (shipping_country ~* '^[A-Z]{2}$');

-- ==========================================
-- Comments
-- ==========================================

COMMENT ON INDEX idx_products_category_status IS 'Optimize category product listings';
COMMENT ON INDEX idx_products_status_created IS 'Optimize product admin list with sorting';
COMMENT ON INDEX idx_orders_user_status IS 'Optimize user order history filtering';
COMMENT ON INDEX idx_orders_user_created IS 'Optimize user order history with sorting';
