package com.tradecraft.repository;

import com.tradecraft.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 分类Repository
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * 查找所有根分类
     */
    List<Category> findByParentIsNull();

    /**
     * 查找所有活跃的根分类
     */
    List<Category> findByParentIsNullAndIsActiveTrue();

    /**
     * 根据父分类ID查找子分类
     */
    List<Category> findByParentId(Long parentId);

    /**
     * 根据父分类ID查找活跃的子分类
     */
    List<Category> findByParentIdAndIsActiveTrue(Long parentId);

    /**
     * 查找所有活跃分类
     */
    List<Category> findByIsActiveTrueOrderBySortOrderAsc();

    /**
     * 查找所有分类（按排序）
     */
    List<Category> findAllByOrderBySortOrderAsc();

    /**
     * 统计子分类数量
     */
    long countByParentId(Long parentId);

    /**
     * 查找包含产品的分类
     */
    @Query("SELECT DISTINCT c FROM Category c JOIN c.products p WHERE p.status = 'ACTIVE'")
    List<Category> findCategoriesWithActiveProducts();
}
