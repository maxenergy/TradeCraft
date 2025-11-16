package com.tradecraft.controller;

import com.tradecraft.dto.response.ApiResponse;
import com.tradecraft.entity.Category;
import com.tradecraft.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类控制器
 * 处理产品分类的CRUD操作
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "分类管理API")
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * 获取所有分类
     */
    @GetMapping
    @Operation(summary = "获取所有分类", description = "获取所有产品分类")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        log.info("Get all categories request");

        List<Category> categories = categoryService.getAllCategories();
        ApiResponse<List<Category>> response = ApiResponse.success(categories);

        return ResponseEntity.ok(response);
    }

    /**
     * 获取根分类
     */
    @GetMapping("/root")
    @Operation(summary = "获取根分类", description = "获取所有顶级分类")
    public ResponseEntity<ApiResponse<List<Category>>> getRootCategories() {
        log.info("Get root categories request");

        List<Category> categories = categoryService.getRootCategories();
        ApiResponse<List<Category>> response = ApiResponse.success(categories);

        return ResponseEntity.ok(response);
    }

    /**
     * 获取活跃分类
     */
    @GetMapping("/active")
    @Operation(summary = "获取活跃分类", description = "获取所有活跃的分类")
    public ResponseEntity<ApiResponse<List<Category>>> getActiveCategories() {
        log.info("Get active categories request");

        List<Category> categories = categoryService.getActiveCategories();
        ApiResponse<List<Category>> response = ApiResponse.success(categories);

        return ResponseEntity.ok(response);
    }

    /**
     * 根据ID获取分类
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取分类详情", description = "根据ID获取分类详细信息")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(
            @PathVariable Long id
    ) {
        log.info("Get category by id: {}", id);

        Category category = categoryService.getCategoryById(id);
        ApiResponse<Category> response = ApiResponse.success(category);

        return ResponseEntity.ok(response);
    }

    /**
     * 获取子分类
     */
    @GetMapping("/{id}/children")
    @Operation(summary = "获取子分类", description = "获取指定分类的所有子分类")
    public ResponseEntity<ApiResponse<List<Category>>> getChildCategories(
            @PathVariable Long id
    ) {
        log.info("Get child categories for parent: {}", id);

        List<Category> categories = categoryService.getChildCategories(id);
        ApiResponse<List<Category>> response = ApiResponse.success(categories);

        return ResponseEntity.ok(response);
    }

    /**
     * 创建分类（仅管理员）
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "创建分类", description = "创建新分类（需要管理员权限）")
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @RequestBody Category category
    ) {
        log.info("Create category request");

        Category createdCategory = categoryService.createCategory(category);
        ApiResponse<Category> response = ApiResponse.success(createdCategory);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * 更新分类（仅管理员）
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "更新分类", description = "更新分类信息（需要管理员权限）")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category
    ) {
        log.info("Update category request: {}", id);

        Category updatedCategory = categoryService.updateCategory(id, category);
        ApiResponse<Category> response = ApiResponse.success(updatedCategory);

        return ResponseEntity.ok(response);
    }

    /**
     * 删除分类（仅管理员）
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "删除分类", description = "删除分类（需要管理员权限）")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable Long id
    ) {
        log.info("Delete category request: {}", id);

        categoryService.deleteCategory(id);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Category deleted successfully")
                .build();

        return ResponseEntity.ok(response);
    }
}
