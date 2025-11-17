package com.tradecraft.entity.enums;

/**
 * 支付状态枚举
 */
public enum PaymentStatus {
    /**
     * 待支付
     */
    PENDING,

    /**
     * 已支付
     */
    PAID,

    /**
     * 支付失败
     */
    FAILED,

    /**
     * 已退款
     */
    REFUNDED
}
