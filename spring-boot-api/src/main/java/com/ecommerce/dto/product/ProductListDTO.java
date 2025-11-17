package com.ecommerce.dto.product;

import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
public class ProductListDTO {
    private Long id;
    private String sku;
    private String nameZhCn;
    private String categoryName;
    private BigDecimal priceCny;
    private Integer stock;
    private String status;
    private String mainImageUrl;
    private OffsetDateTime createdAt;
}
