package com.tradecraft.repository;

import com.tradecraft.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户Repository
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 根据邮箱查找用户
     */
    Optional<User> findByEmail(String email);

    /**
     * 检查邮箱是否存在
     */
    boolean existsByEmail(String email);

    /**
     * 根据邮箱和状态查找用户
     */
    Optional<User> findByEmailAndStatus(String email, User.UserStatus status);

    /**
     * 查找所有管理员
     */
    @Query("SELECT u FROM User u WHERE u.role = 'ADMIN'")
    Iterable<User> findAllAdmins();

    /**
     * 统计活跃用户数
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = 'ACTIVE'")
    long countActiveUsers();

    /**
     * 根据角色统计用户数
     */
    long countByRole(User.UserRole role);
}
