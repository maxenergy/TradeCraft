package com.tradecraft.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderResponse {

    private Long id;
    private String orderNumber;
    private Long userId;
    private String status;
    private BigDecimal totalAmount;
    private String currency;
    private BigDecimal shippingFee;
    private BigDecimal taxAmount;

    // 收货信息
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingCountry;
    private String shippingPostalCode;

    // 支付信息
    private String paymentMethod;
    private String paymentStatus;
    private String paymentTransactionId;
    private LocalDateTime paidAt;

    // 物流信息
    private String trackingNumber;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;

    // 其他信息
    private String notes;
    private Integer itemCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
