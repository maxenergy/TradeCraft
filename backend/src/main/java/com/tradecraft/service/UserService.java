package com.tradecraft.service;

import com.tradecraft.dto.request.LoginRequest;
import com.tradecraft.dto.request.RegisterRequest;
import com.tradecraft.dto.response.AuthResponse;
import com.tradecraft.dto.response.UserResponse;
import com.tradecraft.entity.User;

import java.util.Optional;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 用户注册
     */
    UserResponse register(RegisterRequest request);

    /**
     * 用户登录
     */
    AuthResponse login(LoginRequest request);

    /**
     * 刷新令牌
     */
    AuthResponse refreshToken(String refreshToken);

    /**
     * 根据ID获取用户
     */
    UserResponse getUserById(Long id);

    /**
     * 根据邮箱获取用户
     */
    Optional<User> getUserByEmail(String email);

    /**
     * 更新用户信息
     */
    UserResponse updateUser(Long id, UserResponse userResponse);

    /**
     * 验证邮箱
     */
    void verifyEmail(String token);

    /**
     * 修改密码
     */
    void changePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 检查邮箱是否已存在
     */
    boolean emailExists(String email);
}
