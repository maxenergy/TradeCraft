package com.tradecraft.service.impl;

import com.tradecraft.entity.Category;
import com.tradecraft.exception.ResourceNotFoundException;
import com.tradecraft.repository.CategoryRepository;
import com.tradecraft.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 分类服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public Category createCategory(Category category) {
        log.info("Creating new category: {}", category.getNameEn());

        // 如果有父分类，验证父分类是否存在
        if (category.getParent() != null) {
            Category parent = categoryRepository.findById(category.getParent().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category", "id", category.getParent().getId()));
            category.setParent(parent);
        }

        category = categoryRepository.save(category);
        log.info("Category created successfully: {}", category.getId());

        return category;
    }

    @Override
    @Transactional
    public Category updateCategory(Long id, Category updatedCategory) {
        log.info("Updating category: {}", id);

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        // 更新分类信息
        if (updatedCategory.getNameZhCn() != null) {
            category.setNameZhCn(updatedCategory.getNameZhCn());
        }
        if (updatedCategory.getNameEn() != null) {
            category.setNameEn(updatedCategory.getNameEn());
        }
        if (updatedCategory.getNameId() != null) {
            category.setNameId(updatedCategory.getNameId());
        }
        if (updatedCategory.getSortOrder() != null) {
            category.setSortOrder(updatedCategory.getSortOrder());
        }
        if (updatedCategory.getIsActive() != null) {
            category.setIsActive(updatedCategory.getIsActive());
        }

        category = categoryRepository.save(category);
        log.info("Category updated successfully: {}", category.getId());

        return category;
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        log.info("Deleting category: {}", id);

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        // 检查是否有子分类
        if (category.hasChildren()) {
            throw new IllegalStateException("Cannot delete category with children. Delete children first.");
        }

        categoryRepository.delete(category);
        log.info("Category deleted successfully: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getRootCategories() {
        return categoryRepository.findByParentIsNull();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getChildCategories(Long parentId) {
        Category parent = categoryRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", parentId));
        return categoryRepository.findByParentId(parentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue();
    }
}
