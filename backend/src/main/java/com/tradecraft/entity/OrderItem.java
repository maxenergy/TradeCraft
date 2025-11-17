package com.tradecraft.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * 订单项实体
 */
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "price_snapshot", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceSnapshot;

    @Column(name = "product_name_snapshot", nullable = false, length = 500)
    private String productNameSnapshot;

    @Column(name = "product_sku_snapshot", length = 50)
    private String productSkuSnapshot;

    /**
     * 计算小计
     */
    public BigDecimal getSubtotal() {
        return priceSnapshot.multiply(BigDecimal.valueOf(quantity));
    }
}
