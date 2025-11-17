package com.ecommerce.dto.product;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@Data
public class ProductViewDTO {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private String sku;

    private String nameEn;
    private String nameId;
    private String nameMy;
    private String nameZhCn;
    private String nameZhTw;

    private String descriptionEn;
    private String descriptionId;
    private String descriptionMy;
    private String descriptionZhCn;
    private String descriptionZhTw;

    private List<String> featuresEn;
    private List<String> featuresId;
    private List<String> featuresMy;
    private List<String> featuresZhCn;
    private List<String> featuresZhTw;

    private BigDecimal priceCny;
    private BigDecimal costPriceCny;
    private Integer stock;
    private Map<String, Object> images;
    private Integer weightGrams;
    private Map<String, Integer> dimensions;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
