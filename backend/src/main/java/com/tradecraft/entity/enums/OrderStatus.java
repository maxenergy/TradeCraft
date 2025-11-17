package com.tradecraft.entity.enums;

/**
 * 订单状态枚举
 */
public enum OrderStatus {
    /**
     * 待支付
     */
    PENDING,

    /**
     * 处理中
     */
    PROCESSING,

    /**
     * 已发货
     */
    SHIPPED,

    /**
     * 已送达
     */
    DELIVERED,

    /**
     * 已取消
     */
    CANCELLED,

    /**
     * 退款中
     */
    REFUNDING,

    /**
     * 已退款
     */
    REFUNDED
}
