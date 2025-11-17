package com.tradecraft.entity;

import com.tradecraft.entity.enums.OrderStatus;
import com.tradecraft.entity.enums.PaymentMethod;
import com.tradecraft.entity.enums.PaymentStatus;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 订单实体
 */
@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false, length = 50)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "shipping_fee", precision = 10, scale = 2)
    private BigDecimal shippingFee;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount;

    // 收货地址信息
    @Column(name = "shipping_name", nullable = false, length = 100)
    private String shippingName;

    @Column(name = "shipping_phone", nullable = false, length = 20)
    private String shippingPhone;

    @Column(name = "shipping_address", nullable = false, columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(name = "shipping_city", nullable = false, length = 100)
    private String shippingCity;

    @Column(name = "shipping_state", length = 100)
    private String shippingState;

    @Column(name = "shipping_country", nullable = false, length = 100)
    private String shippingCountry;

    @Column(name = "shipping_postal_code", length = 20)
    private String shippingPostalCode;

    // 支付信息
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 20)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_transaction_id", length = 100)
    private String paymentTransactionId;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    // 物流信息
    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    // 备注
    @Column(columnDefinition = "TEXT")
    private String notes;

    // 额外元数据（JSONB）
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 添加订单项
     */
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    /**
     * 移除订单项
     */
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    /**
     * 计算订单总额
     */
    public BigDecimal calculateTotal() {
        BigDecimal itemsTotal = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shipping = shippingFee != null ? shippingFee : BigDecimal.ZERO;
        BigDecimal tax = taxAmount != null ? taxAmount : BigDecimal.ZERO;

        return itemsTotal.add(shipping).add(tax);
    }

    /**
     * 标记为已支付
     */
    public void markAsPaid(String transactionId) {
        this.paymentStatus = PaymentStatus.PAID;
        this.paymentTransactionId = transactionId;
        this.paidAt = LocalDateTime.now();
        this.status = OrderStatus.PROCESSING;
    }

    /**
     * 标记为已发货
     */
    public void markAsShipped(String trackingNumber) {
        this.status = OrderStatus.SHIPPED;
        this.trackingNumber = trackingNumber;
        this.shippedAt = LocalDateTime.now();
    }

    /**
     * 标记为已送达
     */
    public void markAsDelivered() {
        this.status = OrderStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }

    /**
     * 取消订单
     */
    public void cancel() {
        if (this.status == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel delivered order");
        }
        this.status = OrderStatus.CANCELLED;
    }
}
