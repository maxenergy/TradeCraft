package com.tradecraft.controller;

import com.tradecraft.dto.request.CreateOrderRequest;
import com.tradecraft.dto.response.ApiResponse;
import com.tradecraft.dto.response.OrderResponse;
import com.tradecraft.entity.enums.OrderStatus;
import com.tradecraft.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 订单控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "订单管理API")
@SecurityRequirement(name = "Bearer Authentication")
public class OrderController {

    private final OrderService orderService;

    /**
     * 创建订单
     */
    @PostMapping
    @Operation(summary = "创建订单", description = "从购物车创建订单")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        log.info("Create order for user: {}", userId);

        OrderResponse order = orderService.createOrderFromCart(userId, request);
        ApiResponse<OrderResponse> response = ApiResponse.success(order);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * 获取用户的所有订单
     */
    @GetMapping
    @Operation(summary = "获取我的订单", description = "获取当前用户的所有订单")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        log.info("Get orders for user: {}", userId);

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders = orderService.getUserOrders(userId, pageable);

        ApiResponse.PaginationMeta pagination = ApiResponse.PaginationMeta.builder()
                .page(page)
                .size(size)
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .hasNext(orders.hasNext())
                .hasPrevious(orders.hasPrevious())
                .build();

        ApiResponse<List<OrderResponse>> response = ApiResponse.success(
                orders.getContent(),
                pagination
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 根据订单号获取订单
     */
    @GetMapping("/{orderNumber}")
    @Operation(summary = "获取订单详情", description = "根据订单号获取订单详情")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String orderNumber
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        log.info("Get order {} for user {}", orderNumber, userId);

        OrderResponse order = orderService.getOrderByOrderNumber(orderNumber, userId);
        ApiResponse<OrderResponse> response = ApiResponse.success(order);

        return ResponseEntity.ok(response);
    }

    /**
     * 取消订单
     */
    @PostMapping("/{orderId}/cancel")
    @Operation(summary = "取消订单", description = "取消指定的订单")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long orderId
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        log.info("Cancel order {} for user {}", orderId, userId);

        orderService.cancelOrder(orderId, userId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Order cancelled successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 获取所有订单（管理员）
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "获取所有订单", description = "获取所有订单（管理员）")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("Get all orders - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders = orderService.getAllOrders(pageable);

        ApiResponse.PaginationMeta pagination = ApiResponse.PaginationMeta.builder()
                .page(page)
                .size(size)
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .hasNext(orders.hasNext())
                .hasPrevious(orders.hasPrevious())
                .build();

        ApiResponse<List<OrderResponse>> response = ApiResponse.success(
                orders.getContent(),
                pagination
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 更新订单状态（管理员）
     */
    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "更新订单状态", description = "更新订单状态（管理员）")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        log.info("Update order {} status to {}", orderId, status);

        OrderResponse order = orderService.updateOrderStatus(orderId, status);
        ApiResponse<OrderResponse> response = ApiResponse.success(order);

        return ResponseEntity.ok(response);
    }

    /**
     * 标记订单为已发货（管理员）
     */
    @PostMapping("/admin/{orderId}/ship")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "标记为已发货", description = "标记订单为已发货（管理员）")
    public ResponseEntity<ApiResponse<OrderResponse>> markAsShipped(
            @PathVariable Long orderId,
            @RequestParam String trackingNumber
    ) {
        log.info("Mark order {} as shipped with tracking: {}", orderId, trackingNumber);

        OrderResponse order = orderService.markOrderAsShipped(orderId, trackingNumber);
        ApiResponse<OrderResponse> response = ApiResponse.success(order);

        return ResponseEntity.ok(response);
    }

    /**
     * 标记订单为已送达（管理员）
     */
    @PostMapping("/admin/{orderId}/deliver")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "标记为已送达", description = "标记订单为已送达（管理员）")
    public ResponseEntity<ApiResponse<OrderResponse>> markAsDelivered(
            @PathVariable Long orderId
    ) {
        log.info("Mark order {} as delivered", orderId);

        OrderResponse order = orderService.markOrderAsDelivered(orderId);
        ApiResponse<OrderResponse> response = ApiResponse.success(order);

        return ResponseEntity.ok(response);
    }

    /**
     * 从UserDetails获取用户ID
     * TODO: 实现实际的用户ID获取逻辑
     */
    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        // 这里应该从UserDetails中获取实际的用户ID
        // 暂时返回固定值用于测试
        return 1L;
    }
}
