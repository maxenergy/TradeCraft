package com.tradecraft.entity;

import com.tradecraft.entity.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 产品实体
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(unique = true, nullable = false, length = 50)
    private String sku;

    // 多语言名称
    @Column(name = "name_zh_cn", nullable = false, length = 500)
    private String nameZhCn;

    @Column(name = "name_en", nullable = false, length = 500)
    private String nameEn;

    @Column(name = "name_id", nullable = false, length = 500)
    private String nameId;

    // 多语言描述
    @Column(name = "description_zh_cn", columnDefinition = "TEXT")
    private String descriptionZhCn;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_id", columnDefinition = "TEXT")
    private String descriptionId;

    // 多语言特性（JSONB）
    @Type(JsonType.class)
    @Column(name = "features_zh_cn", columnDefinition = "jsonb")
    private List<String> featuresZhCn;

    @Type(JsonType.class)
    @Column(name = "features_en", columnDefinition = "jsonb")
    private List<String> featuresEn;

    @Type(JsonType.class)
    @Column(name = "features_id", columnDefinition = "jsonb")
    private List<String> featuresId;

    // 多货币价格
    @Column(name = "price_cny", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceCny;

    @Column(name = "price_usd", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceUsd;

    @Column(name = "price_idr", nullable = false, precision = 15, scale = 2)
    private BigDecimal priceIdr;

    @Column(name = "price_myr", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceMyr;

    @Column(name = "cost_cny", precision = 10, scale = 2)
    private BigDecimal costCny;

    // 库存
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "weight_grams")
    private Integer weightGrams;

    // 状态
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductStatus status = ProductStatus.ACTIVE;

    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = false;

    // 图片和标签（JSONB）
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> images;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private List<String> tags;

    // SEO
    @Column(name = "seo_title", length = 200)
    private String seoTitle;

    @Column(name = "seo_description", columnDefinition = "TEXT")
    private String seoDescription;

    @Column(name = "seo_keywords", length = 500)
    private String seoKeywords;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 根据语言获取产品名称
     */
    public String getName(String language) {
        return switch (language.toLowerCase()) {
            case "zh", "zh-cn" -> nameZhCn;
            case "id" -> nameId;
            default -> nameEn;
        };
    }

    /**
     * 根据语言获取产品描述
     */
    public String getDescription(String language) {
        return switch (language.toLowerCase()) {
            case "zh", "zh-cn" -> descriptionZhCn;
            case "id" -> descriptionId;
            default -> descriptionEn;
        };
    }

    /**
     * 根据货币获取价格
     */
    public BigDecimal getPrice(String currency) {
        return switch (currency.toUpperCase()) {
            case "CNY" -> priceCny;
            case "IDR" -> priceIdr;
            case "MYR" -> priceMyr;
            default -> priceUsd;
        };
    }

    /**
     * 检查是否有库存
     */
    public boolean hasStock() {
        return stockQuantity != null && stockQuantity > 0;
    }

    /**
     * 检查是否有足够库存
     */
    public boolean hasStock(int quantity) {
        return hasStock() && stockQuantity >= quantity;
    }

    /**
     * 减少库存
     */
    public void decreaseStock(int quantity) {
        if (!hasStock(quantity)) {
            throw new IllegalStateException("Insufficient stock");
        }
        this.stockQuantity -= quantity;
        if (this.stockQuantity == 0) {
            this.status = ProductStatus.OUT_OF_STOCK;
        }
    }

    /**
     * 增加库存
     */
    public void increaseStock(int quantity) {
        this.stockQuantity += quantity;
        if (this.status == ProductStatus.OUT_OF_STOCK && this.stockQuantity > 0) {
            this.status = ProductStatus.ACTIVE;
        }
    }
}
