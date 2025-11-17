package com.tradecraft.dto.request;

import com.tradecraft.entity.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 创建订单请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotBlank(message = "收货人姓名不能为空")
    @Size(max = 100, message = "收货人姓名长度不能超过100个字符")
    private String shippingName;

    @NotBlank(message = "联系电话不能为空")
    @Size(max = 20, message = "联系电话长度不能超过20个字符")
    private String shippingPhone;

    @NotBlank(message = "收货地址不能为空")
    private String shippingAddress;

    @NotBlank(message = "城市不能为空")
    @Size(max = 100, message = "城市名称长度不能超过100个字符")
    private String shippingCity;

    @Size(max = 100, message = "省/州名称长度不能超过100个字符")
    private String shippingState;

    @NotBlank(message = "国家不能为空")
    @Size(max = 100, message = "国家名称长度不能超过100个字符")
    private String shippingCountry;

    @Size(max = 20, message = "邮政编码长度不能超过20个字符")
    private String shippingPostalCode;

    private PaymentMethod paymentMethod;

    private BigDecimal shippingFee;

    private String notes;
}
