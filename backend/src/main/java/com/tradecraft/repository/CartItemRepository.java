package com.tradecraft.repository;

import com.tradecraft.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 购物车项Repository
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /**
     * 根据用户ID查找所有购物车项
     */
    List<CartItem> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * 根据用户ID和产品ID查找购物车项
     */
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    /**
     * 删除用户的所有购物车项
     */
    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    /**
     * 统计用户购物车中的商品数量
     */
    @Query("SELECT COUNT(c) FROM CartItem c WHERE c.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    /**
     * 检查购物车项是否存在
     */
    boolean existsByUserIdAndProductId(Long userId, Long productId);
}
