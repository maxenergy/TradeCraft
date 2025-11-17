package com.tradecraft.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 购物车项响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private String productImage;
    private Integer quantity;
    private BigDecimal price;
    private String currency;
    private BigDecimal subtotal;
    private Boolean inStock;
    private Integer availableStock;
    private LocalDateTime createdAt;
}
