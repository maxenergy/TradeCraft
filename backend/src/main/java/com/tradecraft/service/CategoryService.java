package com.tradecraft.service;

import com.tradecraft.entity.Category;

import java.util.List;

/**
 * 分类服务接口
 */
public interface CategoryService {

    /**
     * 创建分类
     */
    Category createCategory(Category category);

    /**
     * 更新分类
     */
    Category updateCategory(Long id, Category category);

    /**
     * 删除分类
     */
    void deleteCategory(Long id);

    /**
     * 根据ID获取分类
     */
    Category getCategoryById(Long id);

    /**
     * 获取所有分类
     */
    List<Category> getAllCategories();

    /**
     * 获取根分类（顶级分类）
     */
    List<Category> getRootCategories();

    /**
     * 获取子分类
     */
    List<Category> getChildCategories(Long parentId);

    /**
     * 获取活跃分类
     */
    List<Category> getActiveCategories();
}
