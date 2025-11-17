package com.ecommerce.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class ProductUpdateDTO {

    private Long categoryId;

    @Size(max = 255)
    private String nameEn;
    @Size(max = 255)
    private String nameId;
    @Size(max = 255)
    private String nameMy;
    @Size(max = 255)
    private String nameZhCn;
    @Size(max = 255)
    private String nameZhTw;

    @Size(max = 5000)
    private String descriptionEn;
    @Size(max = 5000)
    private String descriptionId;
    @Size(max = 5000)
    private String descriptionMy;
    @Size(max = 5000)
    private String descriptionZhCn;
    @Size(max = 5000)
    private String descriptionZhTw;

    private List<String> featuresEn;
    private List<String> featuresId;
    private List<String> featuresMy;
    private List<String> featuresZhCn;
    private List<String> featuresZhTw;

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal priceCny;

    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal costPriceCny;

    private Integer stock;
    private Map<String, Object> images;
    private Integer weightGrams;
    private Map<String, Integer> dimensions;
    private String status;
}
