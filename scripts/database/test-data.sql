-- ==========================================
-- TradeCraft 测试数据
-- ==========================================
-- 用于开发环境的测试数据
-- 包括：用户、分类、产品、订单等
-- ==========================================

-- 清理现有测试数据
TRUNCATE TABLE order_items, orders, cart_items, carts, products, categories, users CASCADE;

-- 重置序列
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE carts_id_seq RESTART WITH 1;
ALTER SEQUENCE cart_items_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- ==========================================
-- 用户数据
-- ==========================================

-- 管理员用户 (密码: Admin123!)
INSERT INTO users (email, password, first_name, last_name, phone, role, status, email_verified, created_at, updated_at)
VALUES
    ('admin@tradecraft.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1JzJQogNrJ0l3p5yQ9eJ5ATNX7dF3E6', 'Admin', 'User', '+86-13800138000', 'ADMIN', 'ACTIVE', true, NOW(), NOW()),
    ('manager@tradecraft.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1JzJQogNrJ0l3p5yQ9eJ5ATNX7dF3E6', 'Manager', 'User', '+86-13800138001', 'ADMIN', 'ACTIVE', true, NOW(), NOW());

-- 普通用户 (密码: User123!)
INSERT INTO users (email, password, first_name, last_name, phone, role, status, email_verified, created_at, updated_at)
VALUES
    ('zhang.wei@example.com', '$2a$10$8fHvF/qIFzJzJ8J0wQ3xKuWvB.3FX8tGqF4yqvN1m1WqnC0dF3E6', '张', '伟', '+86-13900139000', 'USER', 'ACTIVE', true, NOW(), NOW()),
    ('li.na@example.com', '$2a$10$8fHvF/qIFzJzJ8J0wQ3xKuWvB.3FX8tGqF4yqvN1m1WqnC0dF3E6', '李', '娜', '+86-13900139001', 'USER', 'ACTIVE', true, NOW(), NOW()),
    ('wang.fang@example.com', '$2a$10$8fHvF/qIFzJzJ8J0wQ3xKuWvB.3FX8tGqF4yqvN1m1WqnC0dF3E6', '王', '芳', '+86-13900139002', 'USER', 'ACTIVE', true, NOW(), NOW()),
    ('liu.yang@example.com', '$2a$10$8fHvF/qIFzJzJ8J0wQ3xKuWvB.3FX8tGqF4yqvN1m1WqnC0dF3E6', '刘', '洋', '+86-13900139003', 'USER', 'ACTIVE', false, NOW(), NOW()),
    ('chen.min@example.com', '$2a$10$8fHvF/qIFzJzJ8J0wQ3xKuWvB.3FX8tGqF4yqvN1m1WqnC0dF3E6', '陈', '敏', '+86-13900139004', 'USER', 'INACTIVE', true, NOW(), NOW());

-- ==========================================
-- 商品分类
-- ==========================================

INSERT INTO categories (name_zh_cn, name_en, name_id, description_zh_cn, description_en, description_id, parent_id, sort_order, is_active, created_at, updated_at)
VALUES
    -- 一级分类
    ('电子产品', 'Electronics', 'Elektronik', '各类电子产品和配件', 'Electronic devices and accessories', 'Perangkat elektronik dan aksesori', NULL, 1, true, NOW(), NOW()),
    ('服装鞋帽', 'Fashion', 'Fashion', '时尚服装和鞋类', 'Fashionable clothing and footwear', 'Pakaian dan alas kaki modis', NULL, 2, true, NOW(), NOW()),
    ('家居生活', 'Home & Living', 'Rumah & Hidup', '家居用品和装饰', 'Home goods and decorations', 'Barang rumah tangga dan dekorasi', NULL, 3, true, NOW(), NOW()),
    ('美妆个护', 'Beauty & Personal Care', 'Kecantikan & Perawatan Pribadi', '美容化妆品和个人护理', 'Beauty cosmetics and personal care', 'Kosmetik kecantikan dan perawatan pribadi', NULL, 4, true, NOW(), NOW()),
    ('食品饮料', 'Food & Beverages', 'Makanan & Minuman', '食品和饮料', 'Food and beverages', 'Makanan dan minuman', NULL, 5, true, NOW(), NOW());

-- 二级分类 - 电子产品
INSERT INTO categories (name_zh_cn, name_en, name_id, description_zh_cn, description_en, description_id, parent_id, sort_order, is_active, created_at, updated_at)
VALUES
    ('手机通讯', 'Mobile Phones', 'Ponsel', '智能手机和配件', 'Smartphones and accessories', 'Smartphone dan aksesori', 1, 1, true, NOW(), NOW()),
    ('电脑办公', 'Computers', 'Komputer', '电脑和办公设备', 'Computers and office equipment', 'Komputer dan peralatan kantor', 1, 2, true, NOW(), NOW()),
    ('数码配件', 'Digital Accessories', 'Aksesori Digital', '各类数码配件', 'Various digital accessories', 'Berbagai aksesori digital', 1, 3, true, NOW(), NOW());

-- 二级分类 - 服装鞋帽
INSERT INTO categories (name_zh_cn, name_en, name_id, description_zh_cn, description_en, description_id, parent_id, sort_order, is_active, created_at, updated_at)
VALUES
    ('男装', 'Men''s Clothing', 'Pakaian Pria', '男士服装', 'Men''s wear', 'Pakaian pria', 2, 1, true, NOW(), NOW()),
    ('女装', 'Women''s Clothing', 'Pakaian Wanita', '女士服装', 'Women''s wear', 'Pakaian wanita', 2, 2, true, NOW(), NOW()),
    ('运动鞋', 'Sneakers', 'Sepatu Olahraga', '运动休闲鞋', 'Sports and casual shoes', 'Sepatu olahraga dan kasual', 2, 3, true, NOW(), NOW());

-- ==========================================
-- 商品数据
-- ==========================================

-- 电子产品 - 手机
INSERT INTO products (category_id, sku, name_zh_cn, name_en, name_id, description_zh_cn, description_en, description_id,
    features_zh_cn, features_en, features_id,
    price_cny, price_usd, price_idr, price_myr, cost_cny,
    stock_quantity, weight_grams, status, is_featured,
    images, tags, created_at, updated_at)
VALUES
    (6, 'PHONE-IP15-BLK-128',
    'iPhone 15 黑色 128GB', 'iPhone 15 Black 128GB', 'iPhone 15 Hitam 128GB',
    '全新iPhone 15，搭载A17芯片，4800万像素主摄', 'New iPhone 15 with A17 chip, 48MP main camera', 'iPhone 15 baru dengan chip A17, kamera utama 48MP',
    '["6.1英寸超视网膜显示屏", "A17仿生芯片", "4800万像素主摄", "支持5G", "面容ID"]'::jsonb,
    '["6.1-inch Super Retina display", "A17 Bionic chip", "48MP main camera", "5G support", "Face ID"]'::jsonb,
    '["Layar Super Retina 6.1 inci", "Chip A17 Bionic", "Kamera utama 48MP", "Dukungan 5G", "Face ID"]'::jsonb,
    6999.00, 999.00, 15350000, 4550, 5500.00,
    50, 200, 'ACTIVE', true,
    '{"main": "https://example.com/iphone15-main.jpg", "gallery": ["https://example.com/iphone15-1.jpg", "https://example.com/iphone15-2.jpg"]}'::jsonb,
    '["手机", "iPhone", "苹果", "5G"]'::jsonb,
    NOW(), NOW()),

    (6, 'PHONE-SAM-S24-WHT-256',
    '三星 Galaxy S24 白色 256GB', 'Samsung Galaxy S24 White 256GB', 'Samsung Galaxy S24 Putih 256GB',
    '三星Galaxy S24旗舰手机，骁龙8 Gen3处理器', 'Samsung Galaxy S24 flagship with Snapdragon 8 Gen 3', 'Samsung Galaxy S24 flagship dengan Snapdragon 8 Gen 3',
    '["6.2英寸Dynamic AMOLED 2X", "骁龙8 Gen3", "5000万像素三摄", "5000mAh电池", "IP68防水"]'::jsonb,
    '["6.2-inch Dynamic AMOLED 2X", "Snapdragon 8 Gen 3", "50MP triple camera", "5000mAh battery", "IP68 water resistance"]'::jsonb,
    '["Layar Dynamic AMOLED 2X 6.2 inci", "Snapdragon 8 Gen 3", "Kamera triple 50MP", "Baterai 5000mAh", "Tahan air IP68"]'::jsonb,
    5499.00, 799.00, 12250000, 3650, 4200.00,
    30, 195, 'ACTIVE', true,
    '{"main": "https://example.com/s24-main.jpg", "gallery": ["https://example.com/s24-1.jpg"]}'::jsonb,
    '["手机", "三星", "Android", "5G"]'::jsonb,
    NOW(), NOW());

-- 电子产品 - 笔记本电脑
INSERT INTO products (category_id, sku, name_zh_cn, name_en, name_id, description_zh_cn, description_en, description_id,
    features_zh_cn, features_en, features_id,
    price_cny, price_usd, price_idr, price_myr, cost_cny,
    stock_quantity, weight_grams, status, is_featured,
    images, tags, created_at, updated_at)
VALUES
    (7, 'LAPTOP-MBA-M3-SLV-16-512',
    'MacBook Air M3 银色 16GB 512GB', 'MacBook Air M3 Silver 16GB 512GB', 'MacBook Air M3 Silver 16GB 512GB',
    'MacBook Air M3芯片，超长续航，轻薄便携', 'MacBook Air with M3 chip, ultra-long battery life, thin and portable', 'MacBook Air dengan chip M3, daya tahan baterai ultra-panjang',
    '["M3芯片", "16GB统一内存", "512GB SSD", "15.3英寸Liquid视网膜显示屏", "最长18小时续航"]'::jsonb,
    '["M3 chip", "16GB unified memory", "512GB SSD", "15.3-inch Liquid Retina display", "Up to 18 hours battery"]'::jsonb,
    '["Chip M3", "Memori terpadu 16GB", "SSD 512GB", "Layar Liquid Retina 15.3 inci", "Hingga 18 jam baterai"]'::jsonb,
    12999.00, 1899.00, 29100000, 8650, 9500.00,
    20, 1500, 'ACTIVE', true,
    '{"main": "https://example.com/macbook-air-main.jpg", "gallery": []}'::jsonb,
    '["笔记本", "MacBook", "苹果", "M3"]'::jsonb,
    NOW(), NOW());

-- 服装 - 男装
INSERT INTO products (category_id, sku, name_zh_cn, name_en, name_id, description_zh_cn, description_en, description_id,
    features_zh_cn, features_en, features_id,
    price_cny, price_usd, price_idr, price_myr, cost_cny,
    stock_quantity, weight_grams, status, is_featured,
    images, tags, created_at, updated_at)
VALUES
    (9, 'SHIRT-POLO-BLU-L',
    '男士经典POLO衫 蓝色 L码', 'Men''s Classic Polo Shirt Blue L', 'Kemeja Polo Klasik Pria Biru L',
    '纯棉POLO衫，舒适透气，商务休闲两相宜', 'Pure cotton polo shirt, comfortable and breathable', 'Kemeja polo katun murni, nyaman dan bernapas',
    '["100%纯棉", "经典翻领设计", "透气舒适", "多色可选", "耐洗耐穿"]'::jsonb,
    '["100% cotton", "Classic collar design", "Breathable and comfortable", "Multiple colors", "Durable"]'::jsonb,
    '["100% katun", "Desain kerah klasik", "Bernapas dan nyaman", "Berbagai warna", "Tahan lama"]'::jsonb,
    199.00, 29.00, 445000, 132, 80.00,
    100, 250, 'ACTIVE', false,
    '{"main": "https://example.com/polo-blue-main.jpg", "gallery": []}'::jsonb,
    '["服装", "男装", "POLO衫", "棉质"]'::jsonb,
    NOW(), NOW());

-- 服装 - 女装
INSERT INTO products (category_id, sku, name_zh_cn, name_en, name_id, description_zh_cn, description_en, description_id,
    features_zh_cn, features_en, features_id,
    price_cny, price_usd, price_idr, price_myr, cost_cny,
    stock_quantity, weight_grams, status, is_featured,
    images, tags, created_at, updated_at)
VALUES
    (10, 'DRESS-SUM-FLR-M',
    '女士夏季碎花连衣裙 M码', 'Women''s Summer Floral Dress M', 'Gaun Bunga Musim Panas Wanita M',
    '清新碎花连衣裙，适合夏日穿着', 'Fresh floral dress, perfect for summer', 'Gaun bunga segar, sempurna untuk musim panas',
    '["雪纺面料", "碎花印花", "A字版型", "高腰设计", "清新甜美"]'::jsonb,
    '["Chiffon fabric", "Floral print", "A-line cut", "High waist design", "Fresh and sweet"]'::jsonb,
    '["Kain sifon", "Cetakan bunga", "Potongan A-line", "Desain pinggang tinggi", "Segar dan manis"]'::jsonb,
    299.00, 45.00, 690000, 205, 120.00,
    80, 300, 'ACTIVE', true,
    '{"main": "https://example.com/dress-floral-main.jpg", "gallery": ["https://example.com/dress-floral-1.jpg"]}'::jsonb,
    '["服装", "女装", "连衣裙", "夏季"]'::jsonb,
    NOW(), NOW());

-- 运动鞋
INSERT INTO products (category_id, sku, name_zh_cn, name_en, name_id, description_zh_cn, description_en, description_id,
    features_zh_cn, features_en, features_id,
    price_cny, price_usd, price_idr, price_myr, cost_cny,
    stock_quantity, weight_grams, status, is_featured,
    images, tags, created_at, updated_at)
VALUES
    (11, 'SHOE-RUN-NKE-BLK-42',
    'Nike Air Max 270 黑色 42码', 'Nike Air Max 270 Black Size 42', 'Nike Air Max 270 Hitam Ukuran 42',
    'Nike经典气垫跑鞋，舒适缓震', 'Nike classic air cushion running shoes, comfortable cushioning', 'Sepatu lari bantalan udara Nike klasik, bantalan nyaman',
    '["Max Air气垫", "网眼鞋面透气", "橡胶外底耐磨", "适合日常穿着", "经典配色"]'::jsonb,
    '["Max Air cushion", "Mesh upper breathable", "Rubber outsole durable", "Suitable for daily wear", "Classic color"]'::jsonb,
    '["Bantalan Max Air", "Upper mesh bernapas", "Sol luar karet tahan lama", "Cocok untuk pemakaian sehari-hari", "Warna klasik"]'::jsonb,
    899.00, 130.00, 1995000, 595, 450.00,
    60, 450, 'ACTIVE', true,
    '{"main": "https://example.com/nike-270-main.jpg", "gallery": []}'::jsonb,
    '["鞋类", "运动鞋", "Nike", "跑鞋"]'::jsonb,
    NOW(), NOW());

-- 更多测试产品（库存不足示例）
INSERT INTO products (category_id, sku, name_zh_cn, name_en, name_id, description_zh_cn, description_en, description_id,
    features_zh_cn, features_en, features_id,
    price_cny, price_usd, price_idr, price_myr, cost_cny,
    stock_quantity, weight_grams, status, is_featured,
    images, tags, created_at, updated_at)
VALUES
    (8, 'ACC-CASE-IP15-BLU',
    'iPhone 15 硅胶保护壳 蓝色', 'iPhone 15 Silicone Case Blue', 'Case Silikon iPhone 15 Biru',
    'Apple官方硅胶保护壳，完美贴合', 'Official Apple silicone case, perfect fit', 'Case silikon resmi Apple, pas sempurna',
    '["官方配件", "柔软硅胶", "完美贴合", "多色可选", "耐用防摔"]'::jsonb,
    '["Official accessory", "Soft silicone", "Perfect fit", "Multiple colors", "Durable drop protection"]'::jsonb,
    '["Aksesori resmi", "Silikon lembut", "Pas sempurna", "Berbagai warna", "Perlindungan jatuh tahan lama"]'::jsonb,
    349.00, 49.00, 752000, 224, 150.00,
    5, 50, 'ACTIVE', false,
    '{"main": "https://example.com/case-ip15-main.jpg", "gallery": []}'::jsonb,
    '["配件", "手机壳", "iPhone", "硅胶"]'::jsonb,
    NOW(), NOW());

-- 已下架产品示例
INSERT INTO products (category_id, sku, name_zh_cn, name_en, name_id, description_zh_cn, description_en, description_id,
    features_zh_cn, features_en, features_id,
    price_cny, price_usd, price_idr, price_myr, cost_cny,
    stock_quantity, weight_grams, status, is_featured,
    images, tags, created_at, updated_at)
VALUES
    (6, 'PHONE-OLD-MODEL',
    '已停产手机', 'Discontinued Phone', 'Ponsel yang Dihentikan',
    '此产品已停产', 'This product is discontinued', 'Produk ini telah dihentikan',
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
    999.00, 149.00, 2285000, 680, 500.00,
    0, 180, 'INACTIVE', false,
    '{}'::jsonb, '["已停产"]'::jsonb,
    NOW(), NOW());

-- ==========================================
-- 购物车数据
-- ==========================================

-- 用户3的购物车
INSERT INTO carts (user_id, created_at, updated_at)
VALUES (3, NOW(), NOW());

INSERT INTO cart_items (cart_id, product_id, quantity, price_snapshot_cny, price_snapshot_usd, price_snapshot_idr, price_snapshot_myr, created_at, updated_at)
VALUES
    (1, 1, 1, 6999.00, 999.00, 15350000, 4550, NOW(), NOW()),  -- iPhone 15
    (1, 7, 2, 349.00, 49.00, 752000, 224, NOW(), NOW());       -- iPhone保护壳 x2

-- 用户4的购物车
INSERT INTO carts (user_id, created_at, updated_at)
VALUES (4, NOW(), NOW());

INSERT INTO cart_items (cart_id, product_id, quantity, price_snapshot_cny, price_snapshot_usd, price_snapshot_idr, price_snapshot_myr, created_at, updated_at)
VALUES
    (2, 5, 1, 299.00, 45.00, 690000, 205, NOW(), NOW()),       -- 连衣裙
    (2, 6, 1, 899.00, 130.00, 1995000, 595, NOW(), NOW());     -- Nike鞋

-- ==========================================
-- 订单数据
-- ==========================================

-- 用户3的已完成订单
INSERT INTO orders (user_id, order_number, status, payment_method, payment_status,
    currency, subtotal, shipping_fee, tax, total,
    shipping_first_name, shipping_last_name, shipping_phone, shipping_address_line1,
    shipping_city, shipping_state, shipping_country, shipping_postal_code,
    created_at, updated_at, paid_at, shipped_at, delivered_at)
VALUES
    (3, 'ORD-2024-000001', 'DELIVERED', 'STRIPE', 'PAID',
    'CNY', 5499.00, 0.00, 0.00, 5499.00,
    '张', '伟', '+86-13900139000', '朝阳区建国路88号',
    '北京', '北京市', 'CN', '100000',
    NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days', NOW() - INTERVAL '28 days', NOW() - INTERVAL '25 days');

INSERT INTO order_items (order_id, product_id, product_sku, product_name, quantity, unit_price, total_price, created_at, updated_at)
VALUES
    (1, 2, 'PHONE-SAM-S24-WHT-256', '三星 Galaxy S24 白色 256GB', 1, 5499.00, 5499.00, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days');

-- 用户4的待发货订单
INSERT INTO orders (user_id, order_number, status, payment_method, payment_status,
    currency, subtotal, shipping_fee, tax, total,
    shipping_first_name, shipping_last_name, shipping_phone, shipping_address_line1,
    shipping_city, shipping_state, shipping_country, shipping_postal_code,
    created_at, updated_at, paid_at)
VALUES
    (4, 'ORD-2024-000002', 'PROCESSING', 'PAYPAL', 'PAID',
    'USD', 174.00, 15.00, 0.00, 189.00,
    'Liu', 'Yang', '+86-13900139003', '浦东新区陆家嘴环路1000号',
    '上海', '上海市', 'CN', '200120',
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

INSERT INTO order_items (order_id, product_id, product_sku, product_name, quantity, unit_price, total_price, created_at, updated_at)
VALUES
    (2, 5, 'DRESS-SUM-FLR-M', '女士夏季碎花连衣裙 M码', 1, 45.00, 45.00, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    (2, 6, 'SHOE-RUN-NKE-BLK-42', 'Nike Air Max 270 黑色 42码', 1, 130.00, 130.00, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- 用户5的待支付订单
INSERT INTO orders (user_id, order_number, status, payment_method, payment_status,
    currency, subtotal, shipping_fee, tax, total,
    shipping_first_name, shipping_last_name, shipping_phone, shipping_address_line1,
    shipping_city, shipping_state, shipping_country, shipping_postal_code,
    created_at, updated_at)
VALUES
    (5, 'ORD-2024-000003', 'PENDING', 'COD', 'PENDING',
    'IDR', 15350000, 50000, 0, 15400000,
    'Chen', 'Min', '+86-13900139004', '天河区珠江新城花城大道85号',
    '广州', '广东省', 'CN', '510000',
    NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour');

INSERT INTO order_items (order_id, product_id, product_sku, product_name, quantity, unit_price, total_price, created_at, updated_at)
VALUES
    (3, 1, 'PHONE-IP15-BLK-128', 'iPhone 15 黑色 128GB', 1, 15350000, 15350000, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour');

-- ==========================================
-- 统计信息
-- ==========================================

DO $$
DECLARE
    user_count INTEGER;
    category_count INTEGER;
    product_count INTEGER;
    order_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO category_count FROM categories;
    SELECT COUNT(*) INTO product_count FROM products;
    SELECT COUNT(*) INTO order_count FROM orders;

    RAISE NOTICE '========================================';
    RAISE NOTICE '测试数据加载完成！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '用户数量: %', user_count;
    RAISE NOTICE '分类数量: %', category_count;
    RAISE NOTICE '产品数量: %', product_count;
    RAISE NOTICE '订单数量: %', order_count;
    RAISE NOTICE '========================================';
    RAISE NOTICE '测试账号:';
    RAISE NOTICE '管理员: admin@tradecraft.com / Admin123!';
    RAISE NOTICE '用户: zhang.wei@example.com / User123!';
    RAISE NOTICE '========================================';
END $$;
