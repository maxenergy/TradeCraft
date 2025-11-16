package com.tradecraft.service;

import com.tradecraft.dto.response.ProductResponse;
import com.tradecraft.entity.Product;
import com.tradecraft.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

/**
 * 产品服务接口
 */
public interface ProductService {

    /**
     * 创建产品
     */
    ProductResponse createProduct(Product product);

    /**
     * 更新产品
     */
    ProductResponse updateProduct(Long id, Product product);

    /**
     * 删除产品
     */
    void deleteProduct(Long id);

    /**
     * 根据ID获取产品
     */
    ProductResponse getProductById(Long id);

    /**
     * 根据SKU获取产品
     */
    ProductResponse getProductBySku(String sku);

    /**
     * 获取所有产品（分页）
     */
    Page<ProductResponse> getAllProducts(Pageable pageable);

    /**
     * 根据分类获取产品
     */
    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

    /**
     * 获取特色产品
     */
    Page<ProductResponse> getFeaturedProducts(Pageable pageable);

    /**
     * 根据价格范围搜索产品
     */
    Page<ProductResponse> getProductsByPriceRange(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    );

    /**
     * 搜索产品（多语言）
     */
    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);

    /**
     * 获取低库存产品
     */
    List<ProductResponse> getLowStockProducts(int threshold);

    /**
     * 减少库存
     */
    void decreaseStock(Long productId, int quantity);

    /**
     * 增加库存
     */
    void increaseStock(Long productId, int quantity);

    /**
     * 更新产品状态
     */
    void updateProductStatus(Long productId, ProductStatus status);
}
