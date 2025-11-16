package com.tradecraft.controller;

import com.tradecraft.dto.request.LoginRequest;
import com.tradecraft.dto.request.RegisterRequest;
import com.tradecraft.dto.response.ApiResponse;
import com.tradecraft.dto.response.AuthResponse;
import com.tradecraft.dto.response.UserResponse;
import com.tradecraft.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 * 处理用户注册、登录、令牌刷新等操作
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "用户认证API")
public class AuthController {

    private final UserService userService;

    /**
     * 用户注册
     */
    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "创建新用户账户")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        log.info("Registration request received for email: {}", request.getEmail());

        UserResponse userResponse = userService.register(request);
        ApiResponse<UserResponse> response = ApiResponse.success(userResponse);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "使用邮箱和密码登录")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        log.info("Login request received for email: {}", request.getEmail());

        AuthResponse authResponse = userService.login(request);
        ApiResponse<AuthResponse> response = ApiResponse.success(authResponse);

        return ResponseEntity.ok(response);
    }

    /**
     * 刷新令牌
     */
    @PostMapping("/refresh")
    @Operation(summary = "刷新令牌", description = "使用刷新令牌获取新的访问令牌")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestBody RefreshTokenRequest request
    ) {
        log.info("Token refresh request received");

        AuthResponse authResponse = userService.refreshToken(request.getRefreshToken());
        ApiResponse<AuthResponse> response = ApiResponse.success(authResponse);

        return ResponseEntity.ok(response);
    }

    /**
     * 检查邮箱是否存在
     */
    @GetMapping("/check-email")
    @Operation(summary = "检查邮箱", description = "检查邮箱是否已被注册")
    public ResponseEntity<ApiResponse<Boolean>> checkEmail(
            @RequestParam String email
    ) {
        boolean exists = userService.emailExists(email);
        ApiResponse<Boolean> response = ApiResponse.success(exists);

        return ResponseEntity.ok(response);
    }

    /**
     * 刷新令牌请求DTO
     */
    public record RefreshTokenRequest(String refreshToken) {}
}
