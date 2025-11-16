package com.tradecraft.service.impl;

import com.tradecraft.dto.request.LoginRequest;
import com.tradecraft.dto.request.RegisterRequest;
import com.tradecraft.dto.response.AuthResponse;
import com.tradecraft.dto.response.UserResponse;
import com.tradecraft.entity.User;
import com.tradecraft.entity.enums.UserRole;
import com.tradecraft.entity.enums.UserStatus;
import com.tradecraft.exception.BadRequestException;
import com.tradecraft.exception.ResourceNotFoundException;
import com.tradecraft.exception.UnauthorizedException;
import com.tradecraft.repository.UserRepository;
import com.tradecraft.service.UserService;
import com.tradecraft.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * 用户服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // 检查邮箱是否已存在
        if (emailExists(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }

        // 创建新用户
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .emailVerified(false)
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getEmail());

        return mapToUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt: {}", request.getEmail());

        try {
            // 认证用户
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            // 加载用户详情
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

            // 检查用户状态
            if (!user.isActive()) {
                throw new UnauthorizedException("Account is inactive");
            }

            // 生成令牌
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("role", user.getRole().name());

            String accessToken = jwtUtil.generateToken(userDetails, claims);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);

            log.info("User logged in successfully: {}", user.getEmail());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(86400L) // 24 hours
                    .user(mapToUserResponse(user))
                    .build();

        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getEmail(), e);
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        log.info("Refreshing token");

        try {
            // 验证刷新令牌
            if (!jwtUtil.validateToken(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            // 提取用户名并加载用户
            String username = jwtUtil.extractUsername(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", username));

            // 生成新的访问令牌
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("role", user.getRole().name());

            String newAccessToken = jwtUtil.generateToken(userDetails, claims);

            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(86400L)
                    .user(mapToUserResponse(user))
                    .build();

        } catch (Exception e) {
            log.error("Token refresh failed", e);
            throw new UnauthorizedException("Invalid refresh token");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserResponse userResponse) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // 更新用户信息
        if (userResponse.getFirstName() != null) {
            user.setFirstName(userResponse.getFirstName());
        }
        if (userResponse.getLastName() != null) {
            user.setLastName(userResponse.getLastName());
        }

        user = userRepository.save(user);
        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        // TODO: Implement email verification logic
        log.info("Email verification not yet implemented");
    }

    @Override
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }

        // 更新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        log.info("Password changed successfully for user: {}", user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * 将User实体映射为UserResponse
     */
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
