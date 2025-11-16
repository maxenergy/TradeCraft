package com.tradecraft.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 产品响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductResponse {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private String sku;

    // 多语言字段
    private String name;
    private String description;
    private List<String> features;

    // 价格（根据用户货币）
    private BigDecimal price;
    private String currency;

    // 所有货币价格（可选）
    private Map<String, BigDecimal> prices;

    // 库存
    private Integer stockQuantity;
    private Integer weightGrams;

    // 状态
    private String status;
    private Boolean isFeatured;
    private Boolean inStock;

    // 图片和标签
    private Map<String, Object> images;
    private List<String> tags;

    // SEO
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;

    // 时间戳
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * 获取主图片URL
     */
    public String getMainImageUrl() {
        if (images != null && images.containsKey("main")) {
            return (String) images.get("main");
        }
        return null;
    }
}
