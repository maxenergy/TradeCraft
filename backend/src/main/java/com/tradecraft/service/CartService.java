package com.tradecraft.service;

import com.tradecraft.entity.CartItem;

import java.util.List;

/**
 * 购物车服务接口
 */
public interface CartService {

    /**
     * 获取用户的购物车
     */
    List<CartItem> getUserCart(Long userId);

    /**
     * 添加商品到购物车
     */
    CartItem addToCart(Long userId, Long productId, Integer quantity);

    /**
     * 更新购物车项数量
     */
    CartItem updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity);

    /**
     * 从购物车删除商品
     */
    void removeFromCart(Long userId, Long cartItemId);

    /**
     * 清空购物车
     */
    void clearCart(Long userId);

    /**
     * 获取购物车商品数量
     */
    Long getCartItemCount(Long userId);
}
