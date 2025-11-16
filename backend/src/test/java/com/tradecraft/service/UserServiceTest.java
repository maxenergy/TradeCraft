package com.tradecraft.service;

import com.tradecraft.dto.request.LoginRequest;
import com.tradecraft.dto.request.RegisterRequest;
import com.tradecraft.dto.response.AuthResponse;
import com.tradecraft.dto.response.UserResponse;
import com.tradecraft.entity.User;
import com.tradecraft.entity.enums.UserRole;
import com.tradecraft.entity.enums.UserStatus;
import com.tradecraft.exception.BadRequestException;
import com.tradecraft.exception.ResourceNotFoundException;
import com.tradecraft.repository.UserRepository;
import com.tradecraft.service.impl.UserServiceImpl;
import com.tradecraft.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 用户服务单元测试
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        // 创建测试用户
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("$2a$10$encoded.password")
                .firstName("John")
                .lastName("Doe")
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .emailVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // 创建注册请求
        registerRequest = new RegisterRequest();
        registerRequest.setEmail("newuser@example.com");
        registerRequest.setPassword("Password123!");
        registerRequest.setFirstName("Jane");
        registerRequest.setLastName("Smith");

        // 创建登录请求
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void testRegisterSuccess() {
        // 准备
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encoded.new.password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // 执行
        UserResponse result = userService.register(registerRequest);

        // 验证
        assertNotNull(result);
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getFirstName(), result.getFirstName());
        assertEquals(testUser.getLastName(), result.getLastName());

        verify(userRepository, times(1)).existsByEmail(registerRequest.getEmail());
        verify(passwordEncoder, times(1)).encode(registerRequest.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterEmailAlreadyExists() {
        // 准备
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // 执行 & 验证
        assertThrows(BadRequestException.class, () -> {
            userService.register(registerRequest);
        });

        verify(userRepository, times(1)).existsByEmail(registerRequest.getEmail());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginSuccess() {
        // 准备
        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(testUser.getEmail())
                .password(testUser.getPassword())
                .roles("USER")
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken(any(UserDetails.class), anyMap())).thenReturn("access.token.123");
        when(jwtUtil.generateRefreshToken(any(UserDetails.class))).thenReturn("refresh.token.456");

        // 执行
        AuthResponse result = userService.login(loginRequest);

        // 验证
        assertNotNull(result);
        assertEquals("access.token.123", result.getAccessToken());
        assertEquals("refresh.token.456", result.getRefreshToken());
        assertEquals("Bearer", result.getTokenType());
        assertNotNull(result.getUser());
        assertEquals(testUser.getEmail(), result.getUser().getEmail());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository, times(1)).findByEmail(testUser.getEmail());
        verify(jwtUtil, times(1)).generateToken(any(UserDetails.class), anyMap());
        verify(jwtUtil, times(1)).generateRefreshToken(any(UserDetails.class));
    }

    @Test
    void testGetUserByIdSuccess() {
        // 准备
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // 执行
        UserResponse result = userService.getUserById(1L);

        // 验证
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getEmail(), result.getEmail());

        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testGetUserByIdNotFound() {
        // 准备
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // 执行 & 验证
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(999L);
        });

        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    void testEmailExists() {
        // 准备
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);

        // 执行 & 验证
        assertTrue(userService.emailExists("existing@example.com"));
        assertFalse(userService.emailExists("new@example.com"));

        verify(userRepository, times(1)).existsByEmail("existing@example.com");
        verify(userRepository, times(1)).existsByEmail("new@example.com");
    }

    @Test
    void testChangePasswordSuccess() {
        // 准备
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("$2a$10$encoded.new.password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // 执行
        assertDoesNotThrow(() -> {
            userService.changePassword(1L, "oldPassword", "newPassword");
        });

        // 验证
        verify(userRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).matches("oldPassword", testUser.getPassword());
        verify(passwordEncoder, times(1)).encode("newPassword");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testChangePasswordIncorrectOldPassword() {
        // 准备
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", testUser.getPassword())).thenReturn(false);

        // 执行 & 验证
        assertThrows(BadRequestException.class, () -> {
            userService.changePassword(1L, "wrongPassword", "newPassword");
        });

        verify(userRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).matches("wrongPassword", testUser.getPassword());
        verify(userRepository, never()).save(any(User.class));
    }
}
