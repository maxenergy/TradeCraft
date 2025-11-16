package com.tradecraft.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 分类实体
 */
@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 多语言名称
    @Column(name = "name_zh_cn", nullable = false, length = 200)
    private String nameZhCn;

    @Column(name = "name_en", nullable = false, length = 200)
    private String nameEn;

    @Column(name = "name_id", nullable = false, length = 200)
    private String nameId;

    // 多语言描述
    @Column(name = "description_zh_cn", columnDefinition = "TEXT")
    private String descriptionZhCn;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_id", columnDefinition = "TEXT")
    private String descriptionId;

    // 父分类（支持多级分类）
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    // 子分类
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Category> children = new ArrayList<>();

    // 产品列表
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Product> products = new ArrayList<>();

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 根据语言获取分类名称
     */
    public String getName(String language) {
        return switch (language.toLowerCase()) {
            case "zh", "zh-cn" -> nameZhCn;
            case "id" -> nameId;
            default -> nameEn;
        };
    }

    /**
     * 根据语言获取分类描述
     */
    public String getDescription(String language) {
        return switch (language.toLowerCase()) {
            case "zh", "zh-cn" -> descriptionZhCn;
            case "id" -> descriptionId;
            default -> descriptionEn;
        };
    }

    /**
     * 检查是否为根分类
     */
    public boolean isRoot() {
        return parent == null;
    }

    /**
     * 检查是否有子分类
     */
    public boolean hasChildren() {
        return children != null && !children.isEmpty();
    }

    /**
     * 添加子分类
     */
    public void addChild(Category child) {
        if (children == null) {
            children = new ArrayList<>();
        }
        children.add(child);
        child.setParent(this);
    }

    /**
     * 移除子分类
     */
    public void removeChild(Category child) {
        if (children != null) {
            children.remove(child);
            child.setParent(null);
        }
    }
}
