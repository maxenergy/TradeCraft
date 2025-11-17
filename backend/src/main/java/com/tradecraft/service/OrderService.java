package com.tradecraft.service;

import com.tradecraft.dto.request.CreateOrderRequest;
import com.tradecraft.dto.response.OrderResponse;
import com.tradecraft.entity.Order;
import com.tradecraft.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 订单服务接口
 */
public interface OrderService {

    /**
     * 创建订单（从购物车）
     */
    OrderResponse createOrderFromCart(Long userId, CreateOrderRequest request);

    /**
     * 根据ID获取订单
     */
    OrderResponse getOrderById(Long orderId, Long userId);

    /**
     * 根据订单号获取订单
     */
    OrderResponse getOrderByOrderNumber(String orderNumber, Long userId);

    /**
     * 获取用户的所有订单
     */
    Page<OrderResponse> getUserOrders(Long userId, Pageable pageable);

    /**
     * 根据状态获取用户订单
     */
    Page<OrderResponse> getUserOrdersByStatus(Long userId, OrderStatus status, Pageable pageable);

    /**
     * 取消订单
     */
    void cancelOrder(Long orderId, Long userId);

    /**
     * 更新订单状态（管理员）
     */
    OrderResponse updateOrderStatus(Long orderId, OrderStatus status);

    /**
     * 标记订单为已支付
     */
    OrderResponse markOrderAsPaid(Long orderId, String transactionId);

    /**
     * 标记订单为已发货
     */
    OrderResponse markOrderAsShipped(Long orderId, String trackingNumber);

    /**
     * 标记订单为已送达
     */
    OrderResponse markOrderAsDelivered(Long orderId);

    /**
     * 获取所有订单（管理员）
     */
    Page<OrderResponse> getAllOrders(Pageable pageable);

    /**
     * 根据状态获取订单（管理员）
     */
    Page<OrderResponse> getOrdersByStatus(OrderStatus status, Pageable pageable);
}
