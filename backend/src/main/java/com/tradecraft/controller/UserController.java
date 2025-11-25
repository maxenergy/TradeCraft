package com.tradecraft.controller;

import com.tradecraft.dto.response.ApiResponse;
import com.tradecraft.dto.response.UserResponse;
import com.tradecraft.security.CustomUserPrincipal;
import com.tradecraft.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 * 处理用户个人资料管理
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "用户管理API")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    @Operation(summary = "获取当前用户信息", description = "获取已登录用户的详细信息")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        log.info("Get current user info: {}", principal.getId());

        UserResponse user = userService.getUserById(principal.getId());
        ApiResponse<UserResponse> response = ApiResponse.success(user);

        return ResponseEntity.ok(response);
    }

    /**
     * 更新当前用户信息
     */
    @PutMapping("/me")
    @Operation(summary = "更新用户信息", description = "更新已登录用户的个人信息")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestBody UpdateUserRequest request
    ) {
        log.info("Update user info: {}", principal.getId());

        UserResponse userResponse = UserResponse.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .build();

        UserResponse updatedUser = userService.updateUser(principal.getId(), userResponse);
        ApiResponse<UserResponse> response = ApiResponse.success(updatedUser);

        return ResponseEntity.ok(response);
    }

    /**
     * 修改密码
     */
    @PostMapping("/me/change-password")
    @Operation(summary = "修改密码", description = "修改当前用户的登录密码")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestBody ChangePasswordRequest request
    ) {
        log.info("Change password for user: {}", principal.getId());

        userService.changePassword(
                principal.getId(),
                request.oldPassword(),
                request.newPassword()
        );

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Password changed successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 根据ID获取用户信息（管理员）
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取用户信息", description = "根据ID获取用户信息（管理员）")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id
    ) {
        log.info("Get user by id: {}", id);

        UserResponse user = userService.getUserById(id);
        ApiResponse<UserResponse> response = ApiResponse.success(user);

        return ResponseEntity.ok(response);
    }

    /**
     * 更新用户信息请求DTO
     */
    public record UpdateUserRequest(
            String firstName,
            String lastName,
            String phone
    ) {}

    /**
     * 修改密码请求DTO
     */
    public record ChangePasswordRequest(
            String oldPassword,
            String newPassword
    ) {}
}
