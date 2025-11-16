package com.tradecraft.service;

import com.tradecraft.dto.response.ProductResponse;
import com.tradecraft.entity.Category;
import com.tradecraft.entity.Product;
import com.tradecraft.entity.enums.ProductStatus;
import com.tradecraft.exception.InsufficientStockException;
import com.tradecraft.exception.ResourceNotFoundException;
import com.tradecraft.repository.ProductRepository;
import com.tradecraft.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 产品服务单元测试
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product testProduct;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        // 创建测试分类
        testCategory = Category.builder()
                .id(1L)
                .nameEn("Electronics")
                .nameZhCn("电子产品")
                .build();

        // 创建测试产品
        testProduct = Product.builder()
                .id(1L)
                .category(testCategory)
                .sku("TEST-001")
                .nameEn("Test Product")
                .nameZhCn("测试产品")
                .descriptionEn("Test Description")
                .descriptionZhCn("测试描述")
                .priceCny(new BigDecimal("100.00"))
                .priceUsd(new BigDecimal("15.00"))
                .stockQuantity(50)
                .status(ProductStatus.ACTIVE)
                .isFeatured(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testCreateProductSuccess() {
        // 准备
        when(productRepository.findBySku(anyString())).thenReturn(Optional.empty());
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // 执行
        ProductResponse result = productService.createProduct(testProduct);

        // 验证
        assertNotNull(result);
        assertEquals(testProduct.getId(), result.getId());
        assertEquals(testProduct.getSku(), result.getSku());
        assertEquals(testProduct.getNameEn(), result.getNameEn());

        verify(productRepository, times(1)).findBySku(testProduct.getSku());
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void testCreateProductDuplicateSku() {
        // 准备
        when(productRepository.findBySku(anyString())).thenReturn(Optional.of(testProduct));

        // 执行 & 验证
        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(testProduct);
        });

        verify(productRepository, times(1)).findBySku(testProduct.getSku());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testGetProductByIdSuccess() {
        // 准备
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // 执行
        ProductResponse result = productService.getProductById(1L);

        // 验证
        assertNotNull(result);
        assertEquals(testProduct.getId(), result.getId());
        assertEquals(testProduct.getSku(), result.getSku());

        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void testGetProductByIdNotFound() {
        // 准备
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // 执行 & 验证
        assertThrows(ResourceNotFoundException.class, () -> {
            productService.getProductById(999L);
        });

        verify(productRepository, times(1)).findById(999L);
    }

    @Test
    void testGetProductBySkuSuccess() {
        // 准备
        when(productRepository.findBySku("TEST-001")).thenReturn(Optional.of(testProduct));

        // 执行
        ProductResponse result = productService.getProductBySku("TEST-001");

        // 验证
        assertNotNull(result);
        assertEquals(testProduct.getSku(), result.getSku());

        verify(productRepository, times(1)).findBySku("TEST-001");
    }

    @Test
    void testGetAllProducts() {
        // 准备
        List<Product> products = Arrays.asList(testProduct);
        Page<Product> productPage = new PageImpl<>(products);
        Pageable pageable = PageRequest.of(0, 20);

        when(productRepository.findAll(pageable)).thenReturn(productPage);

        // 执行
        Page<ProductResponse> result = productService.getAllProducts(pageable);

        // 验证
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testProduct.getId(), result.getContent().get(0).getId());

        verify(productRepository, times(1)).findAll(pageable);
    }

    @Test
    void testGetFeaturedProducts() {
        // 准备
        testProduct.setIsFeatured(true);
        List<Product> products = Arrays.asList(testProduct);
        Page<Product> productPage = new PageImpl<>(products);
        Pageable pageable = PageRequest.of(0, 20);

        when(productRepository.findByIsFeaturedTrueAndStatus(ProductStatus.ACTIVE, pageable))
                .thenReturn(productPage);

        // 执行
        Page<ProductResponse> result = productService.getFeaturedProducts(pageable);

        // 验证
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertTrue(result.getContent().get(0).getIsFeatured());

        verify(productRepository, times(1)).findByIsFeaturedTrueAndStatus(ProductStatus.ACTIVE, pageable);
    }

    @Test
    void testSearchProducts() {
        // 准备
        List<Product> products = Arrays.asList(testProduct);
        Page<Product> productPage = new PageImpl<>(products);
        Pageable pageable = PageRequest.of(0, 20);

        when(productRepository.searchByKeyword("test", ProductStatus.ACTIVE, pageable))
                .thenReturn(productPage);

        // 执行
        Page<ProductResponse> result = productService.searchProducts("test", pageable);

        // 验证
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());

        verify(productRepository, times(1)).searchByKeyword("test", ProductStatus.ACTIVE, pageable);
    }

    @Test
    void testDecreaseStockSuccess() {
        // 准备
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // 执行
        assertDoesNotThrow(() -> {
            productService.decreaseStock(1L, 10);
        });

        // 验证
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void testDecreaseStockInsufficientStock() {
        // 准备
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // 执行 & 验证
        assertThrows(InsufficientStockException.class, () -> {
            productService.decreaseStock(1L, 100); // 请求100，但只有50
        });

        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testIncreaseStockSuccess() {
        // 准备
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // 执行
        assertDoesNotThrow(() -> {
            productService.increaseStock(1L, 20);
        });

        // 验证
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void testUpdateProductStatusSuccess() {
        // 准备
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // 执行
        assertDoesNotThrow(() -> {
            productService.updateProductStatus(1L, ProductStatus.INACTIVE);
        });

        // 验证
        assertEquals(ProductStatus.INACTIVE, testProduct.getStatus());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void testGetLowStockProducts() {
        // 准备
        testProduct.setStockQuantity(5); // 低库存
        List<Product> products = Arrays.asList(testProduct);

        when(productRepository.findLowStockProducts(10)).thenReturn(products);

        // 执行
        List<ProductResponse> result = productService.getLowStockProducts(10);

        // 验证
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getStockQuantity() < 10);

        verify(productRepository, times(1)).findLowStockProducts(10);
    }

    @Test
    void testUpdateProductSuccess() {
        // 准备
        Product updatedProduct = Product.builder()
                .nameEn("Updated Product")
                .priceUsd(new BigDecimal("20.00"))
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // 执行
        ProductResponse result = productService.updateProduct(1L, updatedProduct);

        // 验证
        assertNotNull(result);
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void testDeleteProductSuccess() {
        // 准备
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        doNothing().when(productRepository).delete(testProduct);

        // 执行
        assertDoesNotThrow(() -> {
            productService.deleteProduct(1L);
        });

        // 验证
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).delete(testProduct);
    }
}
