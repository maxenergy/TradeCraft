package com.tradecraft.repository;

import com.tradecraft.entity.Order;
import com.tradecraft.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 订单Repository
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * 根据订单号查找订单
     */
    Optional<Order> findByOrderNumber(String orderNumber);

    /**
     * 根据用户ID查找订单（分页）
     */
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    /**
     * 根据用户ID和状态查找订单
     */
    Page<Order> findByUserIdAndStatusOrderByCreatedAtDesc(
            Long userId,
            OrderStatus status,
            Pageable pageable
    );

    /**
     * 根据状态查找订单
     */
    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    /**
     * 查找指定时间范围内的订单
     */
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findOrdersBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * 统计用户的订单数量
     */
    Long countByUserId(Long userId);

    /**
     * 统计指定状态的订单数量
     */
    Long countByStatus(OrderStatus status);

    /**
     * 检查订单号是否存在
     */
    boolean existsByOrderNumber(String orderNumber);
}
