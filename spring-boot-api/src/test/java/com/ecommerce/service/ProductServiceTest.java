package com.ecommerce.service;

import com.ecommerce.dto.product.ProductCreateDTO;
import com.ecommerce.dto.product.ProductViewDTO;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void createProduct_shouldSucceed_whenCategoryExists() {
        // Arrange
        ProductCreateDTO dto = new ProductCreateDTO();
        dto.setCategoryId(1L);
        dto.setNameZhCn("测试商品");
        dto.setPriceCny(new BigDecimal("100.00"));
        dto.setCostPriceCny(new BigDecimal("50.00"));
        dto.setStock(10);

        Category mockCategory = new Category();
        mockCategory.setId(1L);
        mockCategory.setNameEn("Test Category");

        Product mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setCategory(mockCategory);
        mockProduct.setNameZhCn(dto.getNameZhCn());
        mockProduct.setSku("PROD-MOCK123");
        mockProduct.setStatus("DRAFT");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        // Act
        ProductViewDTO result = productService.createProduct(dto);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("测试商品", result.getNameZhCn());
        assertEquals("DRAFT", result.getStatus());
        verify(categoryRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }
}
