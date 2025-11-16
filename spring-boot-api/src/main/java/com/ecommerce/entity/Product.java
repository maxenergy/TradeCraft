package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(unique = true, nullable = false)
    private String sku;

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(name = "name_id", nullable = false)
    private String nameId;

    @Column(name = "name_my", nullable = false)
    private String nameMy;

    @Column(name = "name_zh_cn", nullable = false)
    private String nameZhCn;

    @Column(name = "name_zh_tw", nullable = false)
    private String nameZhTw;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_id", columnDefinition = "TEXT")
    private String descriptionId;

    @Column(name = "description_my", columnDefinition = "TEXT")
    private String descriptionMy;

    @Column(name = "description_zh_cn", columnDefinition = "TEXT")
    private String descriptionZhCn;

    @Column(name = "description_zh_tw", columnDefinition = "TEXT")
    private String descriptionZhTw;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "features_en", columnDefinition = "jsonb")
    private List<String> featuresEn;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "features_id", columnDefinition = "jsonb")
    private List<String> featuresId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "features_my", columnDefinition = "jsonb")
    private List<String> featuresMy;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "features_zh_cn", columnDefinition = "jsonb")
    private List<String> featuresZhCn;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "features_zh_tw", columnDefinition = "jsonb")
    private List<String> featuresZhTw;

    @Column(name = "price_cny", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceCny;

    @Column(name = "cost_price_cny", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPriceCny;

    @Column(nullable = false)
    private Integer stock;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> images;

    @Column(name = "weight_grams")
    private Integer weightGrams;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Integer> dimensions;

    @Column(nullable = false)
    private String status;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductSku> skus;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
