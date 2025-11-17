package com.tradecraft.repository;

import com.tradecraft.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 订单项Repository
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * 根据订单ID查找所有订单项
     */
    List<OrderItem> findByOrderId(Long orderId);

    /**
     * 根据产品ID查找所有订单项
     */
    List<OrderItem> findByProductId(Long productId);
}
