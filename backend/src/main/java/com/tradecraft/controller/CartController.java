package com.tradecraft.controller;

import com.tradecraft.dto.response.ApiResponse;
import com.tradecraft.dto.response.CartItemResponse;
import com.tradecraft.entity.CartItem;
import com.tradecraft.security.CustomUserPrincipal;
import com.tradecraft.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 购物车控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "购物车管理API")
@SecurityRequirement(name = "Bearer Authentication")
public class CartController {

    private final CartService cartService;

    /**
     * 获取购物车
     */
    @GetMapping
    @Operation(summary = "获取购物车", description = "获取当前用户的购物车")
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCart(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        log.info("Get cart for user: {}", userId);

        List<CartItem> cartItems = cartService.getUserCart(userId);
        List<CartItemResponse> response = cartItems.stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 添加商品到购物车
     */
    @PostMapping("/items")
    @Operation(summary = "添加商品到购物车", description = "将商品添加到购物车")
    public ResponseEntity<ApiResponse<CartItemResponse>> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        log.info("Add product {} to cart for user {}", productId, userId);

        CartItem cartItem = cartService.addToCart(userId, productId, quantity);
        CartItemResponse response = mapToCartItemResponse(cartItem);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 更新购物车项数量
     */
    @PutMapping("/items/{itemId}")
    @Operation(summary = "更新购物车项数量", description = "更新购物车中商品的数量")
    public ResponseEntity<ApiResponse<CartItemResponse>> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @RequestParam Integer quantity
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        log.info("Update cart item {} quantity to {} for user {}", itemId, quantity, userId);

        CartItem cartItem = cartService.updateCartItemQuantity(userId, itemId, quantity);
        CartItemResponse response = mapToCartItemResponse(cartItem);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 从购物车删除商品
     */
    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "删除购物车项", description = "从购物车中删除商品")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        log.info("Remove cart item {} for user {}", itemId, userId);

        cartService.removeFromCart(userId, itemId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Item removed from cart")
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 清空购物车
     */
    @DeleteMapping
    @Operation(summary = "清空购物车", description = "清空购物车中的所有商品")
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        log.info("Clear cart for user {}", userId);

        cartService.clearCart(userId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Cart cleared")
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 获取购物车商品数量
     */
    @GetMapping("/count")
    @Operation(summary = "获取购物车商品数量", description = "获取购物车中商品的总数量")
    public ResponseEntity<ApiResponse<Long>> getCartCount(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Long userId = getUserIdFromUserDetails(userDetails);
        Long count = cartService.getCartItemCount(userId);

        return ResponseEntity.ok(ApiResponse.success(count));
    }

    /**
     * 从UserDetails获取用户ID
     */
    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        if (userDetails instanceof CustomUserPrincipal) {
            return ((CustomUserPrincipal) userDetails).getId();
        }
        throw new IllegalStateException("Unexpected UserDetails type: " + userDetails.getClass().getName());
    }

    /**
     * 映射为CartItemResponse
     */
    private CartItemResponse mapToCartItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getNameEn())
                .productSku(item.getProduct().getSku())
                .productImage(item.getProduct().getImages() != null
                        ? (String) item.getProduct().getImages().get("main")
                        : null)
                .quantity(item.getQuantity())
                .price(item.getPriceSnapshot())
                .currency(item.getCurrencySnapshot())
                .subtotal(item.getSubtotal())
                .inStock(item.getProduct().hasStock())
                .availableStock(item.getProduct().getStockQuantity())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
