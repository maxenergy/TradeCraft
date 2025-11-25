-- ============================================
-- TradeCraft Test Data Seeding Script
-- Purpose: Populate database with realistic test data
-- ============================================

-- Clean existing data (in correct order to avoid foreign key conflicts)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users WHERE email NOT LIKE 'admin@%';

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 100;
ALTER SEQUENCE categories_id_seq RESTART WITH 100;
ALTER SEQUENCE products_id_seq RESTART WITH 100;

-- ============================================
-- Insert Test Users
-- ============================================
-- Password for all test users: "Test123!"
-- Hashed using BCrypt with strength 10
INSERT INTO users (email, password, first_name, last_name, phone, role, status, email_verified, created_at, updated_at)
VALUES
    ('buyer1@test.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z35a5CTpNAEtbzrT4vCr1z2a', 'John', 'Doe', '+86 138 0000 0001', 'USER', 'ACTIVE', true, NOW(), NOW()),
    ('buyer2@test.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z35a5CTpNAEtbzrT4vCr1z2a', 'Jane', 'Smith', '+86 138 0000 0002', 'USER', 'ACTIVE', true, NOW(), NOW()),
    ('buyer3@test.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z35a5CTpNAEtbzrT4vCr1z2a', 'Mike', 'Johnson', '+86 138 0000 0003', 'USER', 'ACTIVE', true, NOW(), NOW()),
    ('seller@test.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z35a5CTpNAEtbzrT4vCr1z2a', 'Sarah', 'Williams', '+86 138 0000 0004', 'ADMIN', 'ACTIVE', true, NOW(), NOW());

-- ============================================
-- Insert Categories (Multilingual)
-- ============================================
INSERT INTO categories (name_zh_cn, name_en, name_id, slug, parent_id, sort_order, is_active, created_at, updated_at)
VALUES
    -- Top Level Categories
    ('电子产品', 'Electronics', 'Elektronik', 'electronics', NULL, 1, true, NOW(), NOW()),
    ('时尚服饰', 'Fashion', 'Mode', 'fashion', NULL, 2, true, NOW(), NOW()),
    ('家居生活', 'Home & Living', 'Rumah & Kehidupan', 'home-living', NULL, 3, true, NOW(), NOW()),
    ('美妆护肤', 'Beauty & Personal Care', 'Kecantikan & Perawatan', 'beauty', NULL, 4, true, NOW(), NOW()),
    ('运动户外', 'Sports & Outdoors', 'Olahraga & Luar Ruangan', 'sports', NULL, 5, true, NOW(), NOW()),

    -- Electronics Subcategories
    ('智能手机', 'Smartphones', 'Smartphone', 'smartphones', 100, 1, true, NOW(), NOW()),
    ('笔记本电脑', 'Laptops', 'Laptop', 'laptops', 100, 2, true, NOW(), NOW()),
    ('耳机音响', 'Audio & Headphones', 'Audio & Headphone', 'audio', 100, 3, true, NOW(), NOW()),

    -- Fashion Subcategories
    ('男装', 'Men''s Clothing', 'Pakaian Pria', 'mens-clothing', 101, 1, true, NOW(), NOW()),
    ('女装', 'Women''s Clothing', 'Pakaian Wanita', 'womens-clothing', 101, 2, true, NOW(), NOW()),
    ('鞋类', 'Shoes', 'Sepatu', 'shoes', 101, 3, true, NOW(), NOW());

-- ============================================
-- Insert Products (Multilingual, Multi-currency)
-- ============================================
INSERT INTO products (
    category_id, sku,
    name_zh_cn, name_en, name_id,
    description_zh_cn, description_en, description_id,
    price_cny, price_usd, price_idr, price_myr,
    stock_quantity, weight_grams, is_featured, status,
    images, tags,
    seo_title_en, seo_description_en,
    created_at, updated_at
)
VALUES
    -- Smartphones
    (
        106, 'PHONE-001',
        '旗舰智能手机 5G 128GB', 'Flagship 5G Smartphone 128GB', 'Smartphone 5G Unggulan 128GB',
        '最新5G旗舰手机，配备高性能处理器和专业级摄像头系统。6.7英寸AMOLED屏幕，128GB存储空间，支持快速充电。',
        'Latest 5G flagship phone with high-performance processor and professional camera system. 6.7-inch AMOLED display, 128GB storage, fast charging support.',
        'Ponsel unggulan 5G terbaru dengan prosesor berkinerja tinggi dan sistem kamera profesional. Layar AMOLED 6,7 inci, penyimpanan 128GB, mendukung pengisian cepat.',
        4999.00, 699.00, 10500000, 3299.00,
        50, 190, true, 'ACTIVE',
        '{"main": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", "gallery": ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", "https://images.unsplash.com/photo-1565849904461-04a58ad377e0"]}',
        ARRAY['5G', 'Smartphone', 'Flagship', 'Camera'],
        'Flagship 5G Smartphone 128GB - Premium Mobile Phone',
        'Buy the latest 5G flagship smartphone with professional camera system, fast charging, and 128GB storage. Free shipping available.',
        NOW(), NOW()
    ),

    (
        106, 'PHONE-002',
        '经济实惠智能手机 64GB', 'Budget Smartphone 64GB', 'Smartphone Hemat 64GB',
        '性价比出色的智能手机，适合日常使用。5.5英寸屏幕，64GB存储，双卡双待。',
        'Excellent value smartphone perfect for daily use. 5.5-inch screen, 64GB storage, dual SIM support.',
        'Smartphone nilai terbaik yang sempurna untuk penggunaan sehari-hari. Layar 5,5 inci, penyimpanan 64GB, dukungan dual SIM.',
        1299.00, 179.00, 2700000, 849.00,
        150, 160, false, 'ACTIVE',
        '{"main": "https://images.unsplash.com/photo-1598327105666-5b89351aff97", "gallery": ["https://images.unsplash.com/photo-1598327105666-5b89351aff97"]}',
        ARRAY['Smartphone', 'Budget', 'Dual SIM'],
        'Budget Smartphone 64GB - Affordable Mobile Phone',
        'Affordable smartphone with great value. 5.5-inch display, 64GB storage, dual SIM. Perfect for daily use.',
        NOW(), NOW()
    ),

    -- Laptops
    (
        107, 'LAPTOP-001',
        '轻薄商务笔记本 15.6英寸', 'Ultrabook Business Laptop 15.6"', 'Laptop Bisnis Ultrabook 15,6"',
        '专业商务笔记本，Intel Core i7处理器，16GB内存，512GB SSD。轻薄便携，续航时间长达12小时。',
        'Professional business laptop with Intel Core i7, 16GB RAM, 512GB SSD. Lightweight and portable with up to 12 hours battery life.',
        'Laptop bisnis profesional dengan Intel Core i7, RAM 16GB, SSD 512GB. Ringan dan portabel dengan daya tahan baterai hingga 12 jam.',
        6999.00, 999.00, 14900000, 4699.00,
        30, 1800, true, 'ACTIVE',
        '{"main": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853", "gallery": ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"]}',
        ARRAY['Laptop', 'Business', 'Ultrabook', 'SSD'],
        'Ultrabook Business Laptop 15.6" - Professional Computer',
        'High-performance business laptop with Intel Core i7, 16GB RAM, and 512GB SSD. Lightweight design with long battery life.',
        NOW(), NOW()
    ),

    -- Audio
    (
        108, 'AUDIO-001',
        '无线降噪耳机', 'Wireless Noise-Cancelling Headphones', 'Headphone Nirkabel Noise-Cancelling',
        '主动降噪无线耳机，提供沉浸式音乐体验。蓝牙5.0连接，续航30小时，舒适佩戴。',
        'Active noise-cancelling wireless headphones for immersive music experience. Bluetooth 5.0, 30-hour battery, comfortable fit.',
        'Headphone nirkabel noise-cancelling aktif untuk pengalaman musik yang imersif. Bluetooth 5.0, baterai 30 jam, nyaman dipakai.',
        1899.00, 269.00, 4000000, 1269.00,
        80, 250, true, 'ACTIVE',
        '{"main": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", "gallery": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e", "https://images.unsplash.com/photo-1484704849700-f032a568e944"]}',
        ARRAY['Headphones', 'Wireless', 'Noise Cancelling', 'Audio'],
        'Wireless Noise-Cancelling Headphones - Premium Audio',
        'Premium wireless headphones with active noise cancellation. 30-hour battery life, Bluetooth 5.0, and superior comfort.',
        NOW(), NOW()
    ),

    -- Men's Fashion
    (
        109, 'MENS-001',
        '男士商务衬衫', 'Men''s Business Shirt', 'Kemeja Bisnis Pria',
        '高品质商务衬衫，采用透气面料，适合正式场合。多色可选，易打理。',
        'High-quality business shirt made from breathable fabric, perfect for formal occasions. Multiple colors available, easy care.',
        'Kemeja bisnis berkualitas tinggi dari kain yang bernapas, sempurna untuk acara formal. Tersedia berbagai warna, mudah dirawat.',
        299.00, 42.00, 630000, 199.00,
        200, 280, false, 'ACTIVE',
        '{"main": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf", "gallery": ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"]}',
        ARRAY['Shirt', 'Men', 'Business', 'Formal'],
        'Men''s Business Shirt - Professional Attire',
        'Professional business shirt for men. Breathable fabric, perfect fit, multiple colors. Ideal for office and formal events.',
        NOW(), NOW()
    ),

    -- Women's Fashion
    (
        110, 'WOMENS-001',
        '女士优雅连衣裙', 'Women''s Elegant Dress', 'Gaun Elegan Wanita',
        '优雅女装连衣裙，适合多种场合。精选面料，剪裁精良，彰显女性魅力。',
        'Elegant women''s dress suitable for various occasions. Premium fabric, excellent tailoring, highlights feminine charm.',
        'Gaun wanita elegan cocok untuk berbagai acara. Kain premium, jahitan sempurna, menonjolkan pesona feminin.',
        459.00, 65.00, 975000, 307.00,
        120, 320, true, 'ACTIVE',
        '{"main": "https://images.unsplash.com/photo-1595777457583-95e059d581b8", "gallery": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8"]}',
        ARRAY['Dress', 'Women', 'Elegant', 'Fashion'],
        'Women''s Elegant Dress - Stylish Fashion',
        'Elegant dress for women. Perfect for parties, dinners, and special occasions. Premium quality fabric and design.',
        NOW(), NOW()
    ),

    -- Shoes
    (
        111, 'SHOES-001',
        '运动休闲鞋', 'Casual Sports Sneakers', 'Sepatu Sneakers Casual',
        '舒适运动休闲鞋，采用透气网面设计，适合日常穿着和轻度运动。',
        'Comfortable casual sports sneakers with breathable mesh design, perfect for daily wear and light exercise.',
        'Sepatu sneakers casual yang nyaman dengan desain mesh yang bernapas, sempurna untuk pemakaian sehari-hari dan olahraga ringan.',
        399.00, 56.00, 840000, 265.00,
        180, 450, false, 'ACTIVE',
        '{"main": "https://images.unsplash.com/photo-1542291026-7eec264c27ff", "gallery": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff", "https://images.unsplash.com/photo-1460353581641-37baddab0fa2"]}',
        ARRAY['Shoes', 'Sneakers', 'Sports', 'Casual'],
        'Casual Sports Sneakers - Comfortable Footwear',
        'Comfortable sneakers perfect for daily wear and sports. Breathable design, great fit, available in multiple sizes.',
        NOW(), NOW()
    ),

    -- Home & Living
    (
        102, 'HOME-001',
        '智能台灯', 'Smart LED Desk Lamp', 'Lampu Meja LED Pintar',
        '可调光智能台灯，支持APP控制和语音助手。护眼设计，多种色温可选。',
        'Dimmable smart LED lamp with app control and voice assistant support. Eye-protection design, multiple color temperatures.',
        'Lampu LED pintar dengan kontrol aplikasi dan dukungan asisten suara. Desain perlindungan mata, berbagai suhu warna tersedia.',
        259.00, 36.00, 540000, 170.00,
        150, 680, false, 'ACTIVE',
        '{"main": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c", "gallery": ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c"]}',
        ARRAY['Lamp', 'Smart Home', 'LED', 'Desk'],
        'Smart LED Desk Lamp - Modern Home Lighting',
        'Smart desk lamp with app control and eye protection. Perfect for reading, studying, and work.',
        NOW(), NOW()
    ),

    -- Beauty
    (
        103, 'BEAUTY-001',
        '保湿护肤套装', 'Hydrating Skincare Set', 'Set Perawatan Kulit Melembapkan',
        '全套保湿护肤产品，包含洁面乳、爽肤水、精华液和面霜。适合干性和混合性肌肤。',
        'Complete hydrating skincare set including cleanser, toner, serum, and moisturizer. Suitable for dry and combination skin.',
        'Set perawatan kulit melembapkan lengkap termasuk pembersih, toner, serum, dan pelembap. Cocok untuk kulit kering dan kombinasi.',
        599.00, 85.00, 1270000, 400.00,
        100, 450, true, 'ACTIVE',
        '{"main": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571", "gallery": ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571"]}',
        ARRAY['Skincare', 'Beauty', 'Moisturizer', 'Set'],
        'Hydrating Skincare Set - Complete Beauty Care',
        'Complete skincare set for hydration and nourishment. Perfect for dry and combination skin types.',
        NOW(), NOW()
    ),

    -- Sports
    (
        104, 'SPORTS-001',
        '瑜伽垫套装', 'Yoga Mat Set', 'Set Matras Yoga',
        '专业瑜伽垫套装，包含瑜伽垫、瑜伽带和收纳袋。防滑设计，环保材质。',
        'Professional yoga mat set including mat, strap, and carrying bag. Non-slip design, eco-friendly material.',
        'Set matras yoga profesional termasuk matras, tali, dan tas. Desain anti-slip, bahan ramah lingkungan.',
        189.00, 27.00, 405000, 127.00,
        120, 1200, false, 'ACTIVE',
        '{"main": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f", "gallery": ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f"]}',
        ARRAY['Yoga', 'Sports', 'Fitness', 'Mat'],
        'Yoga Mat Set - Professional Exercise Equipment',
        'Complete yoga mat set with non-slip design. Perfect for yoga, pilates, and fitness exercises.',
        NOW(), NOW()
    );

-- ============================================
-- Update Statistics
-- ============================================
SELECT 'Test data seeding completed!' as message;
SELECT 'Users: ' || COUNT(*) as count FROM users;
SELECT 'Categories: ' || COUNT(*) as count FROM categories;
SELECT 'Products: ' || COUNT(*) as count FROM products;

-- ============================================
-- Helpful Queries for Testing
-- ============================================
-- Show all products with prices
-- SELECT id, name_en, price_usd, stock_quantity, status FROM products;

-- Show category hierarchy
-- SELECT c1.name_en as parent, c2.name_en as child
-- FROM categories c1
-- LEFT JOIN categories c2 ON c2.parent_id = c1.id
-- WHERE c1.parent_id IS NULL;

-- Test user credentials
-- Email: buyer1@test.com, Password: Test123!
-- Email: seller@test.com, Password: Test123! (Admin)
