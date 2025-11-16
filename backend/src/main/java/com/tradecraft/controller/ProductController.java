package com.tradecraft.controller;

import com.tradecraft.dto.response.ApiResponse;
import com.tradecraft.dto.response.ProductResponse;
import com.tradecraft.entity.Product;
import com.tradecraft.entity.enums.ProductStatus;
import com.tradecraft.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 产品控制器
 * 处理产品的CRUD操作、搜索和库存管理
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "产品管理API")
public class ProductController {

    private final ProductService productService;

    /**
     * 获取所有产品（分页）
     */
    @GetMapping
    @Operation(summary = "获取产品列表", description = "获取所有产品，支持分页")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction
    ) {
        log.info("Get all products request - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ProductResponse> products = productService.getAllProducts(pageable);

        ApiResponse.PaginationMeta pagination = ApiResponse.PaginationMeta.builder()
                .page(page)
                .size(size)
                .totalElements(products.getTotalElements())
                .totalPages(products.getTotalPages())
                .hasNext(products.hasNext())
                .hasPrevious(products.hasPrevious())
                .build();

        ApiResponse<List<ProductResponse>> response = ApiResponse.success(
                products.getContent(),
                pagination
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 根据ID获取产品
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取产品详情", description = "根据ID获取产品详细信息")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
            @PathVariable Long id
    ) {
        log.info("Get product by id: {}", id);

        ProductResponse product = productService.getProductById(id);
        ApiResponse<ProductResponse> response = ApiResponse.success(product);

        return ResponseEntity.ok(response);
    }

    /**
     * 根据SKU获取产品
     */
    @GetMapping("/sku/{sku}")
    @Operation(summary = "根据SKU获取产品", description = "使用SKU查询产品")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductBySku(
            @PathVariable String sku
    ) {
        log.info("Get product by SKU: {}", sku);

        ProductResponse product = productService.getProductBySku(sku);
        ApiResponse<ProductResponse> response = ApiResponse.success(product);

        return ResponseEntity.ok(response);
    }

    /**
     * 根据分类获取产品
     */
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "根据分类获取产品", description = "获取指定分类下的所有产品")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("Get products by category: {}", categoryId);

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getProductsByCategory(categoryId, pageable);

        ApiResponse.PaginationMeta pagination = ApiResponse.PaginationMeta.builder()
                .page(page)
                .size(size)
                .totalElements(products.getTotalElements())
                .totalPages(products.getTotalPages())
                .hasNext(products.hasNext())
                .hasPrevious(products.hasPrevious())
                .build();

        ApiResponse<List<ProductResponse>> response = ApiResponse.success(
                products.getContent(),
                pagination
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 获取特色产品
     */
    @GetMapping("/featured")
    @Operation(summary = "获取特色产品", description = "获取所有特色产品")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("Get featured products");

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getFeaturedProducts(pageable);

        ApiResponse.PaginationMeta pagination = ApiResponse.PaginationMeta.builder()
                .page(page)
                .size(size)
                .totalElements(products.getTotalElements())
                .totalPages(products.getTotalPages())
                .hasNext(products.hasNext())
                .hasPrevious(products.hasPrevious())
                .build();

        ApiResponse<List<ProductResponse>> response = ApiResponse.success(
                products.getContent(),
                pagination
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 搜索产品
     */
    @GetMapping("/search")
    @Operation(summary = "搜索产品", description = "根据关键词搜索产品（多语言）")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("Search products with keyword: {}", keyword);

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.searchProducts(keyword, pageable);

        ApiResponse.PaginationMeta pagination = ApiResponse.PaginationMeta.builder()
                .page(page)
                .size(size)
                .totalElements(products.getTotalElements())
                .totalPages(products.getTotalPages())
                .hasNext(products.hasNext())
                .hasPrevious(products.hasPrevious())
                .build();

        ApiResponse<List<ProductResponse>> response = ApiResponse.success(
                products.getContent(),
                pagination
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 根据价格范围获取产品
     */
    @GetMapping("/price-range")
    @Operation(summary = "价格范围查询", description = "根据价格范围查询产品")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("Get products by price range: {} - {}", minPrice, maxPrice);

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getProductsByPriceRange(
                minPrice, maxPrice, pageable
        );

        ApiResponse.PaginationMeta pagination = ApiResponse.PaginationMeta.builder()
                .page(page)
                .size(size)
                .totalElements(products.getTotalElements())
                .totalPages(products.getTotalPages())
                .hasNext(products.hasNext())
                .hasPrevious(products.hasPrevious())
                .build();

        ApiResponse<List<ProductResponse>> response = ApiResponse.success(
                products.getContent(),
                pagination
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 创建产品（仅管理员）
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "创建产品", description = "创建新产品（需要管理员权限）")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestBody Product product
    ) {
        log.info("Create product request");

        ProductResponse createdProduct = productService.createProduct(product);
        ApiResponse<ProductResponse> response = ApiResponse.success(createdProduct);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * 更新产品（仅管理员）
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "更新产品", description = "更新产品信息（需要管理员权限）")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {
        log.info("Update product request: {}", id);

        ProductResponse updatedProduct = productService.updateProduct(id, product);
        ApiResponse<ProductResponse> response = ApiResponse.success(updatedProduct);

        return ResponseEntity.ok(response);
    }

    /**
     * 删除产品（仅管理员）
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "删除产品", description = "删除产品（需要管理员权限）")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable Long id
    ) {
        log.info("Delete product request: {}", id);

        productService.deleteProduct(id);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Product deleted successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 获取低库存产品（仅管理员）
     */
    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "获取低库存产品", description = "获取库存低于阈值的产品（需要管理员权限）")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold
    ) {
        log.info("Get low stock products with threshold: {}", threshold);

        List<ProductResponse> products = productService.getLowStockProducts(threshold);
        ApiResponse<List<ProductResponse>> response = ApiResponse.success(products);

        return ResponseEntity.ok(response);
    }

    /**
     * 更新产品状态（仅管理员）
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "更新产品状态", description = "更新产品状态（需要管理员权限）")
    public ResponseEntity<ApiResponse<Void>> updateProductStatus(
            @PathVariable Long id,
            @RequestParam ProductStatus status
    ) {
        log.info("Update product {} status to {}", id, status);

        productService.updateProductStatus(id, status);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Product status updated successfully")
                .build();

        return ResponseEntity.ok(response);
    }
}
