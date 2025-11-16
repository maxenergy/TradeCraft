# 跨境电商AI自动化平台 - 详细开发计划（第4部分）

**这是DEVELOPMENT_PLAN.md的续篇，涵盖Week 7-12（用户、订单、支付、上线）**

---

## 五、用户与订单模块（Week 7-8，Day 31-40）

### Day 31-32: 用户认证后端

#### 31.1 JWT配置

**security/JwtTokenProvider.java**:
```java
package com.tradecraft.ecommerce.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 生成JWT Token
     */
    public String generateToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .claim("email", userPrincipal.getEmail())
                .claim("role", userPrincipal.getRole())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 从Token中获取用户ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    /**
     * 验证Token
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (SecurityException ex) {
            log.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
        }
        return false;
    }
}
```

#### 31.2 认证服务

**service/user/UserService.java**:
```java
package com.tradecraft.ecommerce.service.user;

import com.tradecraft.ecommerce.dto.request.auth.RegisterRequest;
import com.tradecraft.ecommerce.dto.request.auth.LoginRequest;
import com.tradecraft.ecommerce.dto.response.auth.AuthResponse;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void logout(Long userId);
    UserResponse getCurrentUser(Long userId);
    UserResponse updateProfile(Long userId, UpdateProfileRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
}
```

**service/user/UserServiceImpl.java**:
```java
package com.tradecraft.ecommerce.service.user;

import com.tradecraft.ecommerce.dto.request.auth.RegisterRequest;
import com.tradecraft.ecommerce.dto.request.auth.LoginRequest;
import com.tradecraft.ecommerce.dto.response.auth.AuthResponse;
import com.tradecraft.ecommerce.entity.User;
import com.tradecraft.ecommerce.entity.UserProfile;
import com.tradecraft.ecommerce.enums.UserRole;
import com.tradecraft.ecommerce.enums.UserStatus;
import com.tradecraft.ecommerce.exception.BusinessException;
import com.tradecraft.ecommerce.exception.ResourceNotFoundException;
import com.tradecraft.ecommerce.repository.UserRepository;
import com.tradecraft.ecommerce.repository.UserProfileRepository;
import com.tradecraft.ecommerce.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getEmail());

        // 检查邮箱是否已存在
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        // 验证密码
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("Passwords do not match");
        }

        // 创建用户
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(UserRole.BUYER)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        // 创建用户资料
        UserProfile profile = UserProfile.builder()
                .user(savedUser)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .language("en")
                .currency("USD")
                .build();

        userProfileRepository.save(profile);

        // 自动登录
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        log.info("User registered successfully: {}", savedUser.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        // 更新最后登录时间
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("User logged in successfully: {}", user.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        log.info("Changing password for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 验证当前密码
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Current password is incorrect");
        }

        // 验证新密码
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BusinessException("New passwords do not match");
        }

        // 更新密码
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully for user: {}", userId);
    }
}
```

#### 31.3 认证控制器

**controller/auth/AuthController.java**:
```java
package com.tradecraft.ecommerce.controller.auth;

import com.tradecraft.ecommerce.dto.request.auth.LoginRequest;
import com.tradecraft.ecommerce.dto.request.auth.RegisterRequest;
import com.tradecraft.ecommerce.dto.response.ApiResponse;
import com.tradecraft.ecommerce.dto.response.auth.AuthResponse;
import com.tradecraft.ecommerce.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "用户认证接口")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "注册新用户账号")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("User registration request: {}", request.getEmail());
        AuthResponse response = userService.register(request);
        return ApiResponse.success(response, "Registration successful");
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户登录获取JWT Token")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("User login request: {}", request.getEmail());
        AuthResponse response = userService.login(request);
        return ApiResponse.success(response, "Login successful");
    }

    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "用户退出登录")
    public ApiResponse<Void> logout() {
        // JWT是无状态的，客户端直接删除token即可
        // 如果需要服务端验证，可以将token加入黑名单（Redis）
        return ApiResponse.success(null, "Logout successful");
    }
}
```

---

### Day 33-34: 用户认证前端

#### 33.1 认证Store

**store/useAuthStore.ts**:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth.api';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          const { token, userId, email: userEmail, role } = response.data;

          set({
            token,
            user: { id: userId, email: userEmail, role },
            isAuthenticated: true,
            isLoading: false,
          });

          // 设置axios默认header
          authApi.setAuthToken(token);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(data);
          const { token, userId, email, role } = response.data;

          set({
            token,
            user: { id: userId, email, role },
            isAuthenticated: true,
            isLoading: false,
          });

          authApi.setAuthToken(token);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        authApi.clearAuthToken();
      },

      setUser: (user: User) => {
        set({ user });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await authApi.getCurrentUser();
          set({ user: response.data });
        } catch (error) {
          // Token过期或无效，清除登录状态
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

#### 33.2 登录页面

**app/[locale]/auth/login/page.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

import { useAuthStore } from '@/store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });

      // 跳转到首页或之前的页面
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      router.push(redirect || '/');
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.error?.message || 'Invalid email or password',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" {...register('rememberMe')} />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>

            {/* Social login (P1 feature) */}
            {/* <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">Google</Button>
              <Button variant="outline">Facebook</Button>
            </div> */}

            {/* Register link */}
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 33.3 注册页面

**app/[locale]/auth/register/page.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

import { useAuthStore } from '@/store/useAuthStore';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const register = useAuthStore((state) => state.register);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);

      toast({
        title: 'Success',
        description: 'Account created successfully',
      });

      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.error?.message || 'Failed to create account',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...registerField('firstName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...registerField('lastName')}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...registerField('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                {...registerField('phone')}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...registerField('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Must be at least 8 characters with letters and numbers
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...registerField('confirmPassword')}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms agreement */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  {...registerField('agreeToTerms')}
                  className={errors.agreeToTerms ? 'border-red-500' : ''}
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>

            {/* Login link */}
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Day 37-38: 购物车后端

#### 37.1 购物车服务

**service/cart/CartService.java**:
```java
package com.tradecraft.ecommerce.service.cart;

import com.tradecraft.ecommerce.dto.request.cart.AddToCartRequest;
import com.tradecraft.ecommerce.dto.request.cart.UpdateCartItemRequest;
import com.tradecraft.ecommerce.dto.response.cart.CartResponse;
import com.tradecraft.ecommerce.entity.CartItem;
import com.tradecraft.ecommerce.entity.Product;
import com.tradecraft.ecommerce.entity.ProductSku;
import com.tradecraft.ecommerce.exception.BusinessException;
import com.tradecraft.ecommerce.exception.ResourceNotFoundException;
import com.tradecraft.ecommerce.repository.CartItemRepository;
import com.tradecraft.ecommerce.repository.ProductRepository;
import com.tradecraft.ecommerce.repository.ProductSkuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductSkuRepository productSkuRepository;

    @Override
    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        log.info("Adding to cart for user: {}", userId);

        // 验证商品是否存在
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // 验证SKU（如果有）
        ProductSku sku = null;
        if (request.getSkuId() != null) {
            sku = productSkuRepository.findById(request.getSkuId())
                    .orElseThrow(() -> new ResourceNotFoundException("SKU not found"));

            // 验证SKU是否属于该商品
            if (!sku.getProduct().getId().equals(product.getId())) {
                throw new BusinessException("SKU does not belong to this product");
            }
        }

        // 检查库存
        int availableStock = sku != null ? sku.getStock() : product.getStock();
        if (availableStock < request.getQuantity()) {
            throw new BusinessException("Insufficient stock");
        }

        // 查找是否已存在相同的购物车项
        CartItem existingItem = cartItemRepository.findByUserIdAndProductIdAndProductSkuId(
                userId,
                request.getProductId(),
                request.getSkuId()
        ).orElse(null);

        if (existingItem != null) {
            // 更新数量
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (newQuantity > availableStock) {
                throw new BusinessException("Insufficient stock");
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            // 创建新的购物车项
            CartItem cartItem = CartItem.builder()
                    .userId(userId)
                    .product(product)
                    .productSku(sku)
                    .quantity(request.getQuantity())
                    .build();

            cartItemRepository.save(cartItem);
        }

        return getCart(userId);
    }

    @Override
    public CartResponse getCart(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        // 计算总价
        BigDecimal subtotal = cartItems.stream()
                .map(item -> {
                    BigDecimal price = item.getProductSku() != null && item.getProductSku().getPriceCny() != null
                            ? item.getProductSku().getPriceCny()
                            : item.getProduct().getPriceCny();
                    return price.multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .items(cartItems.stream().map(this::toCartItemResponse).toList())
                .itemCount(cartItems.stream().mapToInt(CartItem::getQuantity).sum())
                .subtotal(subtotal)
                .currency("CNY")
                .build();
    }

    @Override
    @Transactional
    public void removeFromCart(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        // 验证权限
        if (!cartItem.getUserId().equals(userId)) {
            throw new BusinessException("Unauthorized");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
```

#### 37.2 购物车控制器

**controller/cart/CartController.java**:
```java
package com.tradecraft.ecommerce.controller.cart;

import com.tradecraft.ecommerce.dto.request.cart.AddToCartRequest;
import com.tradecraft.ecommerce.dto.request.cart.UpdateCartItemRequest;
import com.tradecraft.ecommerce.dto.response.ApiResponse;
import com.tradecraft.ecommerce.dto.response.cart.CartResponse;
import com.tradecraft.ecommerce.security.CurrentUser;
import com.tradecraft.ecommerce.security.UserPrincipal;
import com.tradecraft.ecommerce.service.cart.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@Tag(name = "Cart", description = "购物车接口")
@RequiredArgsConstructor
@Slf4j
public class CartController {

    private final CartService cartService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "添加到购物车", description = "将商品添加到购物车")
    public ApiResponse<CartResponse> addToCart(
            @CurrentUser UserPrincipal currentUser,
            @Valid @RequestBody AddToCartRequest request
    ) {
        log.info("Add to cart request for user: {}", currentUser.getId());
        CartResponse cart = cartService.addToCart(currentUser.getId(), request);
        return ApiResponse.success(cart, "Item added to cart");
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "获取购物车", description = "获取当前用户的购物车")
    public ApiResponse<CartResponse> getCart(@CurrentUser UserPrincipal currentUser) {
        CartResponse cart = cartService.getCart(currentUser.getId());
        return ApiResponse.success(cart);
    }

    @PutMapping("/items/{cartItemId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "更新购物车项", description = "更新购物车中商品数量")
    public ApiResponse<CartResponse> updateCartItem(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        CartResponse cart = cartService.updateCartItem(currentUser.getId(), cartItemId, request);
        return ApiResponse.success(cart, "Cart item updated");
    }

    @DeleteMapping("/items/{cartItemId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "删除购物车项", description = "从购物车中删除商品")
    public ApiResponse<Void> removeFromCart(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long cartItemId
    ) {
        cartService.removeFromCart(currentUser.getId(), cartItemId);
        return ApiResponse.success(null, "Item removed from cart");
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "清空购物车", description = "清空购物车所有商品")
    public ApiResponse<Void> clearCart(@CurrentUser UserPrincipal currentUser) {
        cartService.clearCart(currentUser.getId());
        return ApiResponse.success(null, "Cart cleared");
    }
}
```

---

### Day 39-40: 购物车前端与结账流程

完整代码请查看DEVELOPMENT_PLAN_PART5.md文件（由于篇幅限制，Week 9-12的内容已移至第5部分）。

---

**本文档（PART4）涵盖Week 7-8完整实现**：
- ✅ Day 31-32: 用户认证后端（JWT、UserService、AuthController）
- ✅ Day 33-34: 用户认证前端（useAuthStore、登录页、注册页）
- ✅ Day 37-38: 购物车后端（CartService、CartController）

**后续内容请查看**：
- `DEVELOPMENT_PLAN_PART5.md` - Week 9-12（购物车前端、结账、支付、部署）
