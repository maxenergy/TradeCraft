package com.tradecraft.repository;

import com.tradecraft.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * 产品Repository
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * 根据SKU查找产品
     */
    Optional<Product> findBySku(String sku);

    /**
     * 根据分类ID查找产品
     */
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    /**
     * 根据分类ID和状态查找产品
     */
    Page<Product> findByCategoryIdAndStatus(
            Long categoryId,
            Product.ProductStatus status,
            Pageable pageable
    );

    /**
     * 查找活跃产品
     */
    Page<Product> findByStatus(Product.ProductStatus status, Pageable pageable);

    /**
     * 查找精选产品
     */
    Page<Product> findByIsFeaturedTrueAndStatus(
            Product.ProductStatus status,
            Pageable pageable
    );

    /**
     * 根据价格范围查找产品
     */
    @Query("SELECT p FROM Product p WHERE p.priceCny BETWEEN :minPrice AND :maxPrice AND p.status = :status")
    Page<Product> findByPriceRange(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("status") Product.ProductStatus status,
            Pageable pageable
    );

    /**
     * 搜索产品（多语言）
     */
    @Query("SELECT p FROM Product p WHERE " +
           "(LOWER(p.nameZhCn) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.nameEn) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.nameId) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "p.status = :status")
    Page<Product> searchByKeyword(
            @Param("keyword") String keyword,
            @Param("status") Product.ProductStatus status,
            Pageable pageable
    );

    /**
     * 查找库存不足的产品
     */
    @Query("SELECT p FROM Product p WHERE p.stockQuantity < :threshold AND p.status = 'ACTIVE'")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);

    /**
     * 统计活跃产品数量
     */
    long countByStatus(Product.ProductStatus status);

    /**
     * 统计分类下的产品数量
     */
    long countByCategoryId(Long categoryId);
}
