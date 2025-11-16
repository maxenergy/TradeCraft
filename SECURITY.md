# 安全最佳实践

本文档概述了TradeCraft项目的安全最佳实践和安全策略。

## 目录

- [报告安全漏洞](#报告安全漏洞)
- [身份认证与授权](#身份认证与授权)
- [数据保护](#数据保护)
- [API安全](#api安全)
- [依赖管理](#依赖管理)
- [生产环境安全](#生产环境安全)
- [安全检查清单](#安全检查清单)

---

## 报告安全漏洞

如果您发现了安全漏洞，请**不要**公开报告。

### 负责任的披露流程

1. **私密报告**
   - 发送邮件至：security@tradecraft.com
   - 使用PGP加密（密钥ID: XXXX-XXXX-XXXX）

2. **包含信息**
   - 漏洞详细描述
   - 重现步骤
   - 影响范围
   - 建议的修复方案（如有）

3. **响应时间**
   - 确认收到：24小时内
   - 初步评估：3个工作日内
   - 修复计划：7个工作日内
   - 发布补丁：根据严重程度确定

4. **致谢**
   - 我们会在安全公告中感谢负责任的安全研究人员
   - 可选择匿名

---

## 身份认证与授权

### JWT令牌安全

#### 密钥管理

```bash
# 生成强JWT密钥（至少512位）
./scripts/dev/generate-keys.sh --jwt-only

# 定期轮换密钥（建议每90天）
./scripts/dev/generate-keys.sh --jwt-only > new-jwt-secret.txt
```

**最佳实践：**

✅ **推荐做法：**
- 使用至少512位的随机密钥
- 定期轮换JWT密钥
- 设置合理的过期时间（建议不超过24小时）
- 使用HS512或RS256算法
- 在Redis中维护令牌黑名单

❌ **避免做法：**
- 使用硬编码的密钥
- 使用弱密钥（如"secret"）
- 设置过长的过期时间
- 在JWT中存储敏感信息

#### 令牌刷新机制

```java
@Service
public class AuthService {

    // 访问令牌：短期有效（15分钟）
    private static final long ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000; // 15分钟

    // 刷新令牌：长期有效（7天）
    private static final long REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7天

    public AuthResponse refreshToken(String refreshToken) {
        // 验证刷新令牌
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        // 检查令牌是否在黑名单中
        if (tokenBlacklistService.isBlacklisted(refreshToken)) {
            throw new InvalidTokenException("Token has been revoked");
        }

        // 生成新的访问令牌
        String newAccessToken = jwtTokenProvider.generateAccessToken(userId);

        return new AuthResponse(newAccessToken, refreshToken);
    }
}
```

### 密码安全

#### 密码策略

```java
public class PasswordValidator {

    private static final int MIN_LENGTH = 8;
    private static final Pattern UPPERCASE = Pattern.compile("[A-Z]");
    private static final Pattern LOWERCASE = Pattern.compile("[a-z]");
    private static final Pattern DIGIT = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL = Pattern.compile("[!@#$%^&*(),.?\":{}|<>]");

    public static boolean isValid(String password) {
        if (password == null || password.length() < MIN_LENGTH) {
            return false;
        }

        return UPPERCASE.matcher(password).find() &&
               LOWERCASE.matcher(password).find() &&
               DIGIT.matcher(password).find() &&
               SPECIAL.matcher(password).find();
    }
}
```

**密码要求：**
- 最少8个字符
- 至少1个大写字母
- 至少1个小写字母
- 至少1个数字
- 至少1个特殊字符
- 不能是常见密码（检查breached password database）

#### 密码加密

```java
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 使用BCrypt，成本因子为12
        return new BCryptPasswordEncoder(12);
    }
}
```

**最佳实践：**
- 使用BCrypt、Argon2或PBKDF2
- BCrypt成本因子：10-12（平衡安全性和性能）
- 每个密码使用唯一的盐值
- 永远不要存储明文密码
- 永远不要记录密码

### 多因素认证（MFA）

推荐为管理员账户启用MFA：

```java
@Service
public class MfaService {

    public String generateSecret() {
        // 生成TOTP密钥
        return Base32.random();
    }

    public boolean verifyCode(String secret, String code) {
        TimeBasedOneTimePasswordGenerator totp = new TimeBasedOneTimePasswordGenerator();
        String expectedCode = totp.generateOneTimePasswordString(secret, Instant.now());
        return expectedCode.equals(code);
    }
}
```

### 会话管理

```yaml
spring:
  session:
    store-type: redis
    timeout: 30m  # 30分钟无活动后过期

server:
  servlet:
    session:
      cookie:
        http-only: true  # 防止XSS
        secure: true     # 仅HTTPS
        same-site: strict # 防止CSRF
```

---

## 数据保护

### 敏感数据加密

#### 数据库字段加密

```java
@Entity
public class User {

    @Id
    private Long id;

    @Column
    private String email;

    // 加密敏感字段
    @Convert(converter = CreditCardEncryptor.class)
    @Column(columnDefinition = "TEXT")
    private String creditCardNumber;

    @Convert(converter = PhoneEncryptor.class)
    @Column(columnDefinition = "TEXT")
    private String phone;
}

@Component
public class CreditCardEncryptor implements AttributeConverter<String, String> {

    @Autowired
    private EncryptionService encryptionService;

    @Override
    public String convertToDatabaseColumn(String attribute) {
        return encryptionService.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        return encryptionService.decrypt(dbData);
    }
}
```

#### 加密服务

```java
@Service
public class EncryptionService {

    @Value("${encryption.key}")
    private String encryptionKey;

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;

    public String encrypt(String plaintext) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(
                Base64.getDecoder().decode(encryptionKey),
                "AES"
            );

            byte[] iv = new byte[GCM_IV_LENGTH];
            SecureRandom.getInstanceStrong().nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec);

            byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

            // IV + Ciphertext
            byte[] encrypted = new byte[iv.length + ciphertext.length];
            System.arraycopy(iv, 0, encrypted, 0, iv.length);
            System.arraycopy(ciphertext, 0, encrypted, iv.length, ciphertext.length);

            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new EncryptionException("Encryption failed", e);
        }
    }

    public String decrypt(String encrypted) {
        // 实现解密逻辑
        // ...
    }
}
```

**生成加密密钥：**
```bash
# AES-256密钥（32字节）
./scripts/dev/generate-keys.sh --production
```

### 数据脱敏

在日志和响应中脱敏敏感数据：

```java
@JsonSerialize(using = SensitiveDataSerializer.class)
private String creditCard;

public class SensitiveDataSerializer extends JsonSerializer<String> {
    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers)
            throws IOException {
        if (value != null && value.length() > 4) {
            String masked = "**** **** **** " + value.substring(value.length() - 4);
            gen.writeString(masked);
        } else {
            gen.writeNull();
        }
    }
}
```

### 数据备份安全

```bash
# 加密备份
./scripts/database/backup.sh

# 备份文件自动加密
gpg --symmetric --cipher-algo AES256 backup.sql.gz

# 安全传输到OSS（使用HTTPS）
# 设置OSS bucket为私有
# 启用OSS服务端加密
```

---

## API安全

### 速率限制

#### 全局限流

```java
@Configuration
public class RateLimitConfig {

    @Bean
    public RateLimiter apiRateLimiter() {
        return RateLimiter.of("api", RateLimiterConfig.custom()
            .limitForPeriod(100)           // 每个周期最多100个请求
            .limitRefreshPeriod(Duration.ofMinutes(1))  // 1分钟
            .timeoutDuration(Duration.ofSeconds(1))
            .build());
    }
}

@RestControllerAdvice
public class RateLimitInterceptor {

    @Autowired
    private RateLimiter rateLimiter;

    @Around("@annotation(rateLimited)")
    public Object rateLimit(ProceedingJoinPoint joinPoint) throws Throwable {
        if (rateLimiter.acquirePermission()) {
            return joinPoint.proceed();
        } else {
            throw new TooManyRequestsException("Rate limit exceeded");
        }
    }
}
```

#### 端点级限流

```java
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    // 登录端点：更严格的限流
    @PostMapping("/login")
    @RateLimit(maxRequests = 5, period = "1m")
    public AuthResponse login(@RequestBody LoginRequest request) {
        // ...
    }

    // 一般API：标准限流
    @GetMapping("/profile")
    @RateLimit(maxRequests = 100, period = "1m")
    public UserProfile getProfile() {
        // ...
    }
}
```

### 输入验证

#### Bean Validation

```java
public class CreateProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 500, message = "Name must be between 2 and 500 characters")
    private String name;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    @Digits(integer = 10, fraction = 2, message = "Invalid price format")
    private BigDecimal price;

    @Email(message = "Invalid email format")
    private String contactEmail;

    @Pattern(regexp = "^[A-Z0-9-]+$", message = "SKU must contain only uppercase letters, numbers, and hyphens")
    private String sku;
}
```

#### 自定义验证器

```java
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = SafeHtmlValidator.class)
public @interface SafeHtml {
    String message() default "HTML content is not safe";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class SafeHtmlValidator implements ConstraintValidator<SafeHtml, String> {

    private static final PolicyFactory POLICY = Sanitizers.FORMATTING
        .and(Sanitizers.LINKS);

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        String sanitized = POLICY.sanitize(value);
        return value.equals(sanitized);
    }
}
```

### SQL注入防护

✅ **推荐：使用参数化查询**
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // JPA自动参数化
    List<Product> findByCategoryId(Long categoryId);

    // JPQL参数化
    @Query("SELECT p FROM Product p WHERE p.name LIKE :searchTerm")
    List<Product> searchByName(@Param("searchTerm") String searchTerm);

    // 原生SQL参数化
    @Query(value = "SELECT * FROM products WHERE category_id = ?1", nativeQuery = true)
    List<Product> findByCategory(Long categoryId);
}
```

❌ **避免：字符串拼接**
```java
// 危险！容易SQL注入
String query = "SELECT * FROM products WHERE name = '" + userInput + "'";
```

### XSS防护

#### 输出编码

```typescript
// 前端：使用React自动转义
function ProductName({ name }: { name: string }) {
  // React自动转义HTML
  return <h1>{name}</h1>;
}

// 如果需要渲染HTML，使用DOMPurify
import DOMPurify from 'dompurify';

function ProductDescription({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });

  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

#### Content Security Policy

```nginx
# nginx.conf
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.tradecraft.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
" always;
```

### CSRF防护

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .and()
            .cors()
                .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated();

        return http.build();
    }
}
```

前端请求包含CSRF令牌：
```typescript
// axios配置
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// 或手动添加
const csrfToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('XSRF-TOKEN='))
  ?.split('=')[1];

axios.post('/api/v1/orders', data, {
  headers: { 'X-XSRF-TOKEN': csrfToken }
});
```

---

## 依赖管理

### 依赖扫描

#### 后端（Maven）

```bash
# 使用OWASP Dependency Check
cd backend
./mvnw org.owasp:dependency-check-maven:check

# 查看报告
open target/dependency-check-report.html
```

#### 前端（npm）

```bash
# npm审计
cd frontend
npm audit

# 修复漏洞
npm audit fix

# 强制修复（可能破坏兼容性）
npm audit fix --force
```

#### Python（AI服务）

```bash
cd ai-service
source venv/bin/activate

# 使用safety检查
pip install safety
safety check

# 或使用pip-audit
pip install pip-audit
pip-audit
```

### CI/CD安全扫描

在 `.github/workflows/ci.yml` 中集成安全扫描：

```yaml
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # 后端安全扫描
      - name: Run OWASP Dependency Check
        run: |
          cd backend
          ./mvnw org.owasp:dependency-check-maven:check

      # 前端安全扫描
      - name: Run npm audit
        run: |
          cd frontend
          npm audit --audit-level=high

      # 容器扫描
      - name: Run Trivy scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'tradecraft-backend:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

### 依赖更新策略

1. **定期更新**（每月）
   - 更新补丁版本（自动）
   - 审查次要版本
   - 谨慎更新主要版本

2. **安全补丁**（立即）
   - 监控安全公告
   - 优先更新有漏洞的依赖
   - 测试后立即部署

3. **使用Dependabot**

```.github/dependabot.yml
version: 2
updates:
  # 后端依赖
  - package-ecosystem: "maven"
    directory: "/backend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10

  # 前端依赖
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"

  # AI服务依赖
  - package-ecosystem: "pip"
    directory: "/ai-service"
    schedule:
      interval: "weekly"
```

---

## 生产环境安全

### HTTPS配置

```nginx
server {
    listen 443 ssl http2;
    server_name tradecraft.com;

    # SSL证书
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # 现代SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # 其他安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 环境变量安全

```bash
# 不要在代码中硬编码密钥
❌ private static final String API_KEY = "sk-1234567890";

# 使用环境变量
✅ @Value("${stripe.api.key}")
   private String stripeApiKey;

# 生产环境：使用密钥管理服务
# - AWS Secrets Manager
# - Azure Key Vault
# - HashiCorp Vault
```

### 日志安全

```java
@Slf4j
public class OrderService {

    public Order createOrder(CreateOrderRequest request) {
        // ❌ 不要记录敏感信息
        log.info("Creating order: {}", request); // 可能包含信用卡信息

        // ✅ 记录必要的非敏感信息
        log.info("Creating order for user: {} with {} items",
            request.getUserId(), request.getItems().size());

        // ✅ 脱敏后记录
        log.debug("Payment info: {}",maskCreditCard(request.getPaymentInfo()));
    }

    private String maskCreditCard(String cardNumber) {
        if (cardNumber.length() <= 4) return "****";
        return "****" + cardNumber.substring(cardNumber.length() - 4);
    }
}
```

### 数据库安全

```yaml
# 使用只读副本查询
spring:
  datasource:
    primary:
      url: jdbc:postgresql://primary-db:5432/tradecraft
      username: ${DB_USERNAME}
      password: ${DB_PASSWORD}

    readonly:
      url: jdbc:postgresql://readonly-db:5432/tradecraft
      username: ${DB_READONLY_USERNAME}
      password: ${DB_READONLY_PASSWORD}

# 限制数据库用户权限
# CREATE USER tradecraft_readonly WITH PASSWORD 'xxx';
# GRANT CONNECT ON DATABASE tradecraft TO tradecraft_readonly;
# GRANT SELECT ON ALL TABLES IN SCHEMA public TO tradecraft_readonly;
```

### 容器安全

```dockerfile
# 使用非root用户
FROM eclipse-temurin:17-jre-alpine

# 创建专用用户
RUN addgroup -g 1001 tradecraft && \
    adduser -u 1001 -G tradecraft -s /bin/sh -D tradecraft

WORKDIR /app
COPY --chown=tradecraft:tradecraft app.jar .

# 切换到非root用户
USER tradecraft

CMD ["java", "-jar", "app.jar"]
```

---

## 安全检查清单

### 部署前检查

- [ ] 所有密钥使用环境变量，无硬编码
- [ ] JWT密钥强度 >= 512位
- [ ] 数据库密码复杂度足够
- [ ] Redis配置了密码
- [ ] HTTPS已配置并强制使用
- [ ] SSL/TLS使用现代配置
- [ ] 安全响应头已配置
- [ ] CORS策略正确配置
- [ ] CSRF保护已启用
- [ ] 速率限制已配置
- [ ] 输入验证覆盖所有端点
- [ ] 日志不包含敏感信息
- [ ] 数据库备份已加密
- [ ] 容器使用非root用户
- [ ] 依赖无已知高危漏洞

### 定期检查（每月）

- [ ] 更新所有依赖包
- [ ] 运行安全扫描
- [ ] 审查访问日志异常
- [ ] 检查失败登录尝试
- [ ] 验证备份完整性
- [ ] 审查用户权限
- [ ] 轮换API密钥
- [ ] 更新SSL证书（如需要）

### 安全审计（每季度）

- [ ] 完整的渗透测试
- [ ] 代码安全审查
- [ ] 依赖关系审计
- [ ] 访问控制审计
- [ ] 数据加密审计
- [ ] 日志审计
- [ ] 灾难恢复演练

---

## 安全资源

### 工具

- **OWASP ZAP**: Web应用安全扫描
- **SonarQube**: 代码质量和安全分析
- **Trivy**: 容器漏洞扫描
- **Snyk**: 依赖漏洞扫描
- **Burp Suite**: 应用安全测试

### 学习资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security文档](https://spring.io/projects/spring-security)
- [NIST网络安全框架](https://www.nist.gov/cyberframework)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)

### 合规性

根据业务需求，可能需要符合：
- **PCI DSS**: 信用卡数据处理
- **GDPR**: 欧盟用户数据
- **CCPA**: 加州用户数据
- **等保2.0**: 中国网络安全

---

**记住：安全是一个持续的过程，而不是一次性的任务。**
