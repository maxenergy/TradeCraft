package com.tradecraft.service.impl;

import com.tradecraft.dto.request.CreateOrderRequest;
import com.tradecraft.dto.response.OrderResponse;
import com.tradecraft.entity.*;
import com.tradecraft.entity.enums.OrderStatus;
import com.tradecraft.entity.enums.PaymentStatus;
import com.tradecraft.exception.BadRequestException;
import com.tradecraft.exception.ResourceNotFoundException;
import com.tradecraft.repository.CartItemRepository;
import com.tradecraft.repository.OrderRepository;
import com.tradecraft.repository.ProductRepository;
import com.tradecraft.repository.UserRepository;
import com.tradecraft.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

/**
 * 订单服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public OrderResponse createOrderFromCart(Long userId, CreateOrderRequest request) {
        log.info("Creating order from cart for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // 获取购物车项
        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // 创建订单
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .status(OrderStatus.PENDING)
                .currency("CNY") // 默认货币
                .shippingName(request.getShippingName())
                .shippingPhone(request.getShippingPhone())
                .shippingAddress(request.getShippingAddress())
                .shippingCity(request.getShippingCity())
                .shippingState(request.getShippingState())
                .shippingCountry(request.getShippingCountry())
                .shippingPostalCode(request.getShippingPostalCode())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .shippingFee(request.getShippingFee() != null ? request.getShippingFee() : BigDecimal.ZERO)
                .taxAmount(BigDecimal.ZERO)
                .notes(request.getNotes())
                .build();

        // 创建订单项并检查库存
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            // 检查库存
            if (!product.hasStock(cartItem.getQuantity())) {
                throw new BadRequestException("Insufficient stock for product: " + product.getNameEn());
            }

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceSnapshot(cartItem.getPriceSnapshot())
                    .productNameSnapshot(product.getNameEn())
                    .productSkuSnapshot(product.getSku())
                    .build();

            order.addItem(orderItem);

            // 减少库存
            product.decreaseStock(cartItem.getQuantity());
            productRepository.save(product);
        }

        // 计算总额
        order.setTotalAmount(order.calculateTotal());

        // 保存订单
        order = orderRepository.save(order);

        // 清空购物车
        cartItemRepository.deleteByUserId(userId);

        log.info("Order created successfully: {}", order.getOrderNumber());

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // 验证订单属于该用户
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Order does not belong to user");
        }

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String orderNumber, Long userId) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));

        // 验证订单属于该用户
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Order does not belong to user");
        }

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToOrderResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getUserOrdersByStatus(Long userId, OrderStatus status, Pageable pageable) {
        return orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status, pageable)
                .map(this::mapToOrderResponse);
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId, Long userId) {
        log.info("Cancelling order {} for user {}", orderId, userId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // 验证订单属于该用户
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Order does not belong to user");
        }

        // 取消订单
        order.cancel();

        // 恢复库存
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.increaseStock(item.getQuantity());
            productRepository.save(product);
        }

        orderRepository.save(order);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        log.info("Updating order {} status to {}", orderId, status);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setStatus(status);
        order = orderRepository.save(order);

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse markOrderAsPaid(Long orderId, String transactionId) {
        log.info("Marking order {} as paid", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.markAsPaid(transactionId);
        order = orderRepository.save(order);

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse markOrderAsShipped(Long orderId, String trackingNumber) {
        log.info("Marking order {} as shipped with tracking: {}", orderId, trackingNumber);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.markAsShipped(trackingNumber);
        order = orderRepository.save(order);

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse markOrderAsDelivered(Long orderId) {
        log.info("Marking order {} as delivered", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.markAsDelivered();
        order = orderRepository.save(order);

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(this::mapToOrderResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                .map(this::mapToOrderResponse);
    }

    /**
     * 生成订单号
     */
    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uniqueId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "ORD-" + timestamp + "-" + uniqueId;
    }

    /**
     * 映射为OrderResponse
     */
    private OrderResponse mapToOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser().getId())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .currency(order.getCurrency())
                .shippingFee(order.getShippingFee())
                .taxAmount(order.getTaxAmount())
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingCity(order.getShippingCity())
                .shippingState(order.getShippingState())
                .shippingCountry(order.getShippingCountry())
                .shippingPostalCode(order.getShippingPostalCode())
                .paymentMethod(order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null)
                .paymentStatus(order.getPaymentStatus().name())
                .paymentTransactionId(order.getPaymentTransactionId())
                .paidAt(order.getPaidAt())
                .trackingNumber(order.getTrackingNumber())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .notes(order.getNotes())
                .itemCount(order.getItems().size())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
