package com.ecommerce.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class ProductCreateDTO {

    @NotNull(message = "Category ID cannot be null")
    private Long categoryId;

    @NotEmpty(message = "Chinese name cannot be empty")
    @Size(max = 255)
    private String nameZhCn;

    @Size(max = 5000)
    private String descriptionZhCn;

    private List<String> featuresZhCn;

    @NotNull(message = "Price cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    private BigDecimal priceCny;

    @NotNull(message = "Cost price cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Cost price must be positive")
    private BigDecimal costPriceCny;

    @NotNull(message = "Stock cannot be null")
    private Integer stock;

    @NotNull(message = "Images cannot be null")
    private Map<String, Object> images;

    private Integer weightGrams;

    private Map<String, Integer> dimensions;

    private Boolean requiresHalalCert;
}
