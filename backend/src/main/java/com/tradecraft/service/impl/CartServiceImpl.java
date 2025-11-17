package com.tradecraft.service.impl;

import com.tradecraft.entity.CartItem;
import com.tradecraft.entity.Product;
import com.tradecraft.entity.User;
import com.tradecraft.exception.BadRequestException;
import com.tradecraft.exception.ResourceNotFoundException;
import com.tradecraft.repository.CartItemRepository;
import com.tradecraft.repository.ProductRepository;
import com.tradecraft.repository.UserRepository;
import com.tradecraft.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 购物车服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CartItem> getUserCart(Long userId) {
        log.info("Getting cart for user: {}", userId);
        return cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional
    public CartItem addToCart(Long userId, Long productId, Integer quantity) {
        log.info("Adding product {} to cart for user {}, quantity: {}", productId, userId, quantity);

        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        // 检查库存
        if (!product.hasStock(quantity)) {
            throw new BadRequestException("Insufficient stock for product: " + product.getNameEn());
        }

        // 检查是否已存在于购物车
        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(userId, productId);

        if (existingItem.isPresent()) {
            // 更新数量
            CartItem cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + quantity;

            if (!product.hasStock(newQuantity)) {
                throw new BadRequestException("Insufficient stock for requested quantity");
            }

            cartItem.setQuantity(newQuantity);
            return cartItemRepository.save(cartItem);
        } else {
            // 创建新的购物车项
            CartItem cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(quantity)
                    .priceSnapshot(product.getPriceCny()) // 默认使用人民币价格
                    .currencySnapshot("CNY")
                    .build();

            return cartItemRepository.save(cartItem);
        }
    }

    @Override
    @Transactional
    public CartItem updateCartItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        log.info("Updating cart item {} quantity to {} for user {}", cartItemId, quantity, userId);

        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        // 验证购物车项属于该用户
        if (!cartItem.getUser().getId().equals(userId)) {
            throw new BadRequestException("Cart item does not belong to user");
        }

        // 检查库存
        Product product = cartItem.getProduct();
        if (!product.hasStock(quantity)) {
            throw new BadRequestException("Insufficient stock for requested quantity");
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @Override
    @Transactional
    public void removeFromCart(Long userId, Long cartItemId) {
        log.info("Removing cart item {} for user {}", cartItemId, userId);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        // 验证购物车项属于该用户
        if (!cartItem.getUser().getId().equals(userId)) {
            throw new BadRequestException("Cart item does not belong to user");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        log.info("Clearing cart for user {}", userId);
        cartItemRepository.deleteByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCartItemCount(Long userId) {
        return cartItemRepository.countByUserId(userId);
    }
}
