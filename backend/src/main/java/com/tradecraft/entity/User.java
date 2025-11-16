package com.tradecraft.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 用户实体
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 用户角色枚举
     */
    public enum UserRole {
        USER,
        ADMIN
    }

    /**
     * 用户状态枚举
     */
    public enum UserStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED
    }

    /**
     * 获取用户全名
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }

    /**
     * 检查是否为管理员
     */
    public boolean isAdmin() {
        return role == UserRole.ADMIN;
    }

    /**
     * 检查账户是否活跃
     */
    public boolean isActive() {
        return status == UserStatus.ACTIVE;
    }
}
