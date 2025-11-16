# 跨境电商AI自动化平台 - 详细开发计划（续）

**这是DEVELOPMENT_PLAN.md的续篇**

---

## 三、商品管理模块（Week 3-4，Day 11-20）

### Day 11-12: 商品CRUD后端实现

#### 11.1 Repository层

**ProductRepository.java**:
```java
package com.tradecraft.ecommerce.repository;

import com.tradecraft.ecommerce.entity.Product;
import com.tradecraft.ecommerce.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>,
                                           JpaSpecificationExecutor<Product> {

    // 基础查询
    Optional<Product> findBySku(String sku);

    boolean existsBySku(String sku);

    // 按状态查询
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    // 按分类查询
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Product> findByCategoryIdAndStatus(Long categoryId, ProductStatus status, Pageable pageable);

    // 价格范围查询
    Page<Product> findByPriceCnyBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // 库存相关
    List<Product> findByStockLessThanEqual(Integer threshold);

    // 全文搜索（使用PostgreSQL的tsvector）
    @Query(value = """
        SELECT p.* FROM products p
        WHERE to_tsvector('english', p.name_en || ' ' || COALESCE(p.description_en, ''))
        @@ plainto_tsquery('english', :searchTerm)
        AND p.status = 'PUBLISHED'
        """, nativeQuery = true)
    Page<Product> searchProductsEn(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query(value = """
        SELECT p.* FROM products p
        WHERE to_tsvector('indonesian', p.name_id || ' ' || COALESCE(p.description_id, ''))
        @@ plainto_tsquery('indonesian', :searchTerm)
        AND p.status = 'PUBLISHED'
        """, nativeQuery = true)
    Page<Product> searchProductsId(@Param("searchTerm") String searchTerm, Pageable pageable);

    // 热销商品
    List<Product> findTop10ByStatusOrderBySalesCountDesc(ProductStatus status);

    // 最新商品
    List<Product> findTop10ByStatusOrderByCreatedAtDesc(ProductStatus status);

    // 统计
    long countByStatus(ProductStatus status);

    @Query("SELECT SUM(p.stock) FROM Product p WHERE p.status = :status")
    Long getTotalStockByStatus(@Param("status") ProductStatus status);
}
```

**CategoryRepository.java**:
```java
package com.tradecraft.ecommerce.repository;

import com.tradecraft.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findBySlug(String slug);

    List<Category> findByParentIdIsNullAndIsActiveTrue();

    List<Category> findByParentIdAndIsActiveTrue(Long parentId);

    @Query("SELECT c FROM Category c WHERE c.isActive = true ORDER BY c.displayOrder ASC")
    List<Category> findAllActiveOrderByDisplayOrder();

    boolean existsBySlug(String slug);
}
```

#### 11.2 Service层

**ProductService.java**:
```java
package com.tradecraft.ecommerce.service.product;

import com.tradecraft.ecommerce.dto.request.product.CreateProductRequest;
import com.tradecraft.ecommerce.dto.request.product.UpdateProductRequest;
import com.tradecraft.ecommerce.dto.request.product.ProductSearchRequest;
import com.tradecraft.ecommerce.dto.response.PageResponse;
import com.tradecraft.ecommerce.dto.response.product.ProductResponse;
import com.tradecraft.ecommerce.entity.Product;
import com.tradecraft.ecommerce.enums.ProductStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    // CRUD操作
    ProductResponse createProduct(CreateProductRequest request);

    ProductResponse getProductById(Long id);

    ProductResponse getProductBySku(String sku);

    ProductResponse updateProduct(Long id, UpdateProductRequest request);

    void deleteProduct(Long id);

    // 列表查询
    PageResponse<ProductResponse> getProducts(ProductSearchRequest request, Pageable pageable);

    PageResponse<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

    PageResponse<ProductResponse> getProductsByStatus(ProductStatus status, Pageable pageable);

    // 搜索
    PageResponse<ProductResponse> searchProducts(String searchTerm, String locale, Pageable pageable);

    // 状态管理
    ProductResponse publishProduct(Long id);

    ProductResponse archiveProduct(Long id);

    // 库存管理
    void updateStock(Long id, Integer quantity);

    void decrementStock(Long id, Integer quantity);

    void incrementStock(Long id, Integer quantity);

    List<ProductResponse> getLowStockProducts();

    // 统计
    void incrementViewCount(Long id);

    void incrementSalesCount(Long id, Integer quantity);

    // 热销商品
    List<ProductResponse> getFeaturedProducts(int limit);

    List<ProductResponse> getLatestProducts(int limit);

    List<ProductResponse> getRelatedProducts(Long productId, int limit);
}
```

**ProductServiceImpl.java**（部分实现）:
```java
package com.tradecraft.ecommerce.service.product;

import com.tradecraft.ecommerce.dto.request.product.CreateProductRequest;
import com.tradecraft.ecommerce.dto.response.product.ProductResponse;
import com.tradecraft.ecommerce.entity.Category;
import com.tradecraft.ecommerce.entity.Product;
import com.tradecraft.ecommerce.enums.ProductStatus;
import com.tradecraft.ecommerce.exception.ResourceNotFoundException;
import com.tradecraft.ecommerce.exception.BusinessException;
import com.tradecraft.ecommerce.mapper.ProductMapper;
import com.tradecraft.ecommerce.repository.CategoryRepository;
import com.tradecraft.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        log.info("Creating product with name: {}", request.getNameZhCn());

        // 验证分类是否存在
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // 生成SKU
        String sku = generateSku();

        // 验证SKU唯一性
        if (productRepository.existsBySku(sku)) {
            throw new BusinessException("SKU already exists: " + sku);
        }

        // 构建Product实体
        Product product = Product.builder()
            .category(category)
            .sku(sku)
            .nameZhCn(request.getNameZhCn())
            .descriptionZhCn(request.getDescriptionZhCn())
            .featuresZhCn(request.getFeaturesZhCn())
            .priceCny(request.getPriceCny())
            .costPriceCny(request.getCostPriceCny())
            .stock(request.getStock())
            .stockAlertThreshold(request.getStockAlertThreshold())
            .images(request.getImages())
            .weightGrams(request.getWeightGrams())
            .dimensions(request.getDimensions())
            .isFragile(request.getIsFragile())
            .requiresHalalCert(request.getRequiresHalalCert())
            .status(ProductStatus.DRAFT)
            .salesCount(0)
            .viewCount(0)
            .build();

        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with ID: {}", savedProduct.getId());

        return productMapper.toResponse(savedProduct);
    }

    @Override
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getProductById(Long id) {
        log.info("Fetching product with ID: {}", id);

        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    @CacheEvict(value = "products", key = "#id")
    public ProductResponse publishProduct(Long id) {
        log.info("Publishing product with ID: {}", id);

        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // 验证必填字段
        validateProductForPublish(product);

        product.setStatus(ProductStatus.PUBLISHED);
        product.setPublishedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        // TODO: 同步到Meilisearch

        return productMapper.toResponse(savedProduct);
    }

    @Override
    @Transactional
    public void decrementStock(Long id, Integer quantity) {
        log.info("Decrementing stock for product ID: {}, quantity: {}", id, quantity);

        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < quantity) {
            throw new BusinessException("Insufficient stock for product: " + product.getSku());
        }

        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }

    // 私有方法
    private String generateSku() {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "PROD-" + timestamp + "-" + uuid;
    }

    private void validateProductForPublish(Product product) {
        if (product.getNameEn() == null || product.getNameEn().isBlank()) {
            throw new BusinessException("English name is required for publishing");
        }
        if (product.getNameId() == null || product.getNameId().isBlank()) {
            throw new BusinessException("Indonesian name is required for publishing");
        }
        if (product.getImages() == null || product.getImages().isEmpty()) {
            throw new BusinessException("At least one image is required for publishing");
        }
        if (product.getStock() <= 0) {
            throw new BusinessException("Stock must be greater than 0 for publishing");
        }
    }
}
```

#### 11.3 Controller层

**AdminProductController.java**:
```java
package com.tradecraft.ecommerce.controller.admin;

import com.tradecraft.ecommerce.dto.request.product.CreateProductRequest;
import com.tradecraft.ecommerce.dto.request.product.UpdateProductRequest;
import com.tradecraft.ecommerce.dto.request.product.ProductSearchRequest;
import com.tradecraft.ecommerce.dto.response.ApiResponse;
import com.tradecraft.ecommerce.dto.response.PageResponse;
import com.tradecraft.ecommerce.dto.response.product.ProductResponse;
import com.tradecraft.ecommerce.service.product.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/products")
@Tag(name = "Admin Product Management", description = "管理后台商品管理接口")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    @PostMapping
    @Operation(summary = "创建商品", description = "创建新的商品（草稿状态）")
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        log.info("Creating product: {}", request.getNameZhCn());
        ProductResponse response = productService.createProduct(request);
        return ApiResponse.success(response, "Product created successfully");
    }

    @GetMapping
    @Operation(summary = "获取商品列表", description = "分页获取商品列表，支持筛选和搜索")
    public ApiResponse<PageResponse<ProductResponse>> getProducts(
            @ModelAttribute ProductSearchRequest searchRequest,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        PageResponse<ProductResponse> response = productService.getProducts(searchRequest, pageable);
        return ApiResponse.success(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取商品详情", description = "根据ID获取商品详细信息")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ApiResponse.success(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新商品", description = "更新商品信息")
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        log.info("Updating product ID: {}", id);
        ProductResponse response = productService.updateProduct(id, request);
        return ApiResponse.success(response, "Product updated successfully");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除商品", description = "删除商品（软删除）")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        log.info("Deleting product ID: {}", id);
        productService.deleteProduct(id);
        return ApiResponse.success(null, "Product deleted successfully");
    }

    @PostMapping("/{id}/publish")
    @Operation(summary = "发布商品", description = "将草稿商品发布到前台")
    public ApiResponse<ProductResponse> publishProduct(@PathVariable Long id) {
        log.info("Publishing product ID: {}", id);
        ProductResponse response = productService.publishProduct(id);
        return ApiResponse.success(response, "Product published successfully");
    }

    @PostMapping("/{id}/archive")
    @Operation(summary = "下架商品", description = "将商品下架（前台隐藏）")
    public ApiResponse<ProductResponse> archiveProduct(@PathVariable Long id) {
        log.info("Archiving product ID: {}", id);
        ProductResponse response = productService.archiveProduct(id);
        return ApiResponse.success(response, "Product archived successfully");
    }

    @GetMapping("/low-stock")
    @Operation(summary = "获取低库存商品", description = "获取库存低于预警阈值的商品列表")
    public ApiResponse<List<ProductResponse>> getLowStockProducts() {
        List<ProductResponse> response = productService.getLowStockProducts();
        return ApiResponse.success(response);
    }
}
```

#### 11.4 DTO定义

**CreateProductRequest.java**:
```java
package com.tradecraft.ecommerce.dto.request.product;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class CreateProductRequest {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Chinese name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String nameZhCn;

    @NotBlank(message = "Description is required")
    private String descriptionZhCn;

    private List<String> featuresZhCn;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal priceCny;

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.01", message = "Cost price must be greater than 0")
    private BigDecimal costPriceCny;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock must be non-negative")
    private Integer stock;

    @Min(value = 0, message = "Stock alert threshold must be non-negative")
    private Integer stockAlertThreshold = 10;

    @NotNull(message = "Images are required")
    private Map<String, Object> images;

    @Min(value = 0, message = "Weight must be non-negative")
    private Integer weightGrams;

    private Map<String, Integer> dimensions;

    private Boolean isFragile = false;

    private Boolean requiresHalalCert = false;
}
```

**ProductResponse.java**:
```java
package com.tradecraft.ecommerce.dto.response.product;

import com.tradecraft.ecommerce.enums.ProductStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class ProductResponse {

    private Long id;
    private String sku;
    private Long categoryId;
    private String categoryName;

    // 多语言字段（根据请求语言返回）
    private String name;
    private String description;
    private List<String> features;
    private String seoTitle;
    private String seoDescription;
    private List<String> keywords;

    // 所有语言的名称（管理后台使用）
    private Map<String, String> allNames;

    // 价格（根据请求货币返回）
    private BigDecimal price;
    private String currency;

    // 原始价格（人民币）
    private BigDecimal priceCny;
    private BigDecimal costPriceCny;

    // 库存
    private Integer stock;
    private Integer stockAlertThreshold;
    private String stockStatus; // IN_STOCK, LOW_STOCK, OUT_OF_STOCK

    // 图片
    private Map<String, Object> images;

    // 物流
    private Integer weightGrams;
    private Map<String, Integer> dimensions;
    private Boolean isFragile;
    private Boolean requiresHalalCert;

    // 状态
    private ProductStatus status;

    // 统计
    private Integer salesCount;
    private Integer viewCount;

    // 时间
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;

    // SKU列表
    private List<ProductSkuResponse> skus;
}
```

---

### Day 13-15: 商品管理前端（管理后台）

#### 13.1 商品列表页面

**app/admin/products/page.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductTable } from '@/components/product/admin/ProductTable';
import { ProductFilter } from '@/components/product/admin/ProductFilter';
import { Pagination } from '@/components/common/Pagination';

import { productApi } from '@/lib/api/product.api';
import { ProductSearchRequest } from '@/types/product';

export default function ProductListPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ProductSearchRequest>({});
  const [showFilters, setShowFilters] = useState(false);

  // 获取商品列表
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-products', page, search, filters],
    queryFn: () => productApi.getProducts({
      ...filters,
      search,
      page,
      size: 20,
    }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    refetch();
  };

  return (
    <div className="container mx-auto py-8">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">商品管理</h1>
        <Link href="/admin/products/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            添加商品
          </Button>
        </Link>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="搜索商品名称、SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" variant="secondary">
            <Search className="mr-2 h-4 w-4" />
            搜索
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
        </form>

        {/* 筛选面板 */}
        {showFilters && (
          <ProductFilter
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters);
              setPage(0);
            }}
          />
        )}
      </div>

      {/* 商品表格 */}
      <div className="bg-white rounded-lg shadow">
        <ProductTable
          products={data?.data.items || []}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      </div>

      {/* 分页 */}
      {data && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={data.data.pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
```

#### 13.2 商品表格组件

**components/product/admin/ProductTable.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { Edit, Trash2, Eye, Archive } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

import { ProductResponse } from '@/types/product';
import { productApi } from '@/lib/api/product.api';
import { formatCurrency } from '@/lib/utils/currency';

interface ProductTableProps {
  products: ProductResponse[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function ProductTable({ products, isLoading, onRefresh }: ProductTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await productApi.deleteProduct(deleteId);
      toast({
        title: '成功',
        description: '商品已删除',
      });
      onRefresh();
    } catch (error) {
      toast({
        title: '错误',
        description: '删除商品失败',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      DRAFT: 'secondary',
      PUBLISHED: 'default',
      ARCHIVED: 'destructive',
    };

    const labels: Record<string, string> = {
      DRAFT: '草稿',
      PUBLISHED: '已发布',
      ARCHIVED: '已下架',
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getStockBadge = (stock: number, threshold: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">缺货</Badge>;
    }
    if (stock <= threshold) {
      return <Badge variant="secondary">库存预警</Badge>;
    }
    return <Badge variant="default">充足</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-500">
        <p className="text-lg">暂无商品</p>
        <p className="text-sm mt-2">点击"添加商品"按钮创建您的第一个商品</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">图片</TableHead>
            <TableHead>商品信息</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>价格</TableHead>
            <TableHead>库存</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={product.images.main || '/placeholder-product.png'}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
              </TableCell>
              <TableCell>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-500">
                  销量: {product.salesCount} | 浏览: {product.viewCount}
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {product.sku}
              </TableCell>
              <TableCell>{product.categoryName}</TableCell>
              <TableCell>
                <div className="font-medium">
                  {formatCurrency(product.price, product.currency)}
                </div>
                <div className="text-sm text-gray-500">
                  成本: ¥{product.costPriceCny}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span>{product.stock}</span>
                  {getStockBadge(product.stock, product.stockAlertThreshold)}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(product.status)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/products/${product.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个商品吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? '删除中...' : '删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

#### 13.3 商品添加页面

**app/admin/products/add/page.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

import { ProductFormBasicInfo } from '@/components/product/admin/ProductFormBasicInfo';
import { ProductFormPricing } from '@/components/product/admin/ProductFormPricing';
import { ProductFormImages } from '@/components/product/admin/ProductFormImages';

import { productApi } from '@/lib/api/product.api';
import { productSchema } from '@/lib/validation/schemas';

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId: undefined,
      nameZhCn: '',
      descriptionZhCn: '',
      featuresZhCn: [],
      priceCny: 0,
      costPriceCny: 0,
      stock: 0,
      stockAlertThreshold: 10,
      images: { main: '', gallery: [] },
      weightGrams: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      isFragile: false,
      requiresHalalCert: false,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const response = await productApi.createProduct(data);
      toast({
        title: '成功',
        description: '商品创建成功',
      });
      router.push(`/admin/products/${response.data.id}`);
    } catch (error) {
      toast({
        title: '错误',
        description: '创建商品失败，请重试',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: '基本信息', component: ProductFormBasicInfo },
    { number: 2, title: '定价库存', component: ProductFormPricing },
    { number: 3, title: '图片物流', component: ProductFormImages },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">添加商品</h1>

      {/* 步骤指示器 */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.number
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.number}
            </div>
            <span className="ml-2 mr-4">{step.title}</span>
            {index < steps.length - 1 && (
              <div className="w-16 h-0.5 bg-gray-300 mr-4" />
            )}
          </div>
        ))}
      </div>

      {/* 表单 */}
      <Card className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CurrentStepComponent form={form} />

          {/* 按钮 */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              上一步
            </Button>

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
              >
                下一步
              </Button>
            ) : (
              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  保存草稿
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '创建中...' : '创建商品'}
                </Button>
              </div>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
```

---

### Day 16-17: 阿里云OSS集成

#### 16.1 OSS服务（后端）

**OssService.java**:
```java
package com.tradecraft.ecommerce.service.storage;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.PutObjectRequest;
import com.aliyun.oss.model.PutObjectResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Date;
import java.util.UUID;

@Service
@Slf4j
public class OssService {

    @Value("${aliyun.oss.endpoint}")
    private String endpoint;

    @Value("${aliyun.oss.bucket}")
    private String bucketName;

    @Value("${aliyun.oss.access-key-id}")
    private String accessKeyId;

    @Value("${aliyun.oss.access-key-secret}")
    private String accessKeySecret;

    @Value("${aliyun.oss.base-url}")
    private String baseUrl;

    private OSS ossClient;

    @PostConstruct
    public void init() {
        log.info("Initializing OSS client");
        ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
    }

    @PreDestroy
    public void destroy() {
        if (ossClient != null) {
            ossClient.shutdown();
            log.info("OSS client shutdown");
        }
    }

    /**
     * 上传文件
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ?
            originalFilename.substring(originalFilename.lastIndexOf(".")) : "";

        String fileName = folder + "/" + UUID.randomUUID() + extension;

        try (InputStream inputStream = file.getInputStream()) {
            PutObjectRequest putObjectRequest = new PutObjectRequest(
                bucketName,
                fileName,
                inputStream
            );

            PutObjectResult result = ossClient.putObject(putObjectRequest);
            log.info("File uploaded successfully: {}", fileName);

            return baseUrl + "/" + fileName;
        }
    }

    /**
     * 生成预签名URL（用于前端直传）
     */
    public String generatePresignedUrl(String objectName, long expirationMinutes) {
        Date expiration = new Date(System.currentTimeMillis() + expirationMinutes * 60 * 1000);
        URL url = ossClient.generatePresignedUrl(bucketName, objectName, expiration);
        return url.toString();
    }

    /**
     * 删除文件
     */
    public void deleteFile(String objectName) {
        ossClient.deleteObject(bucketName, objectName);
        log.info("File deleted: {}", objectName);
    }

    /**
     * 检查文件是否存在
     */
    public boolean doesFileExist(String objectName) {
        return ossClient.doesObjectExist(bucketName, objectName);
    }
}
```

#### 16.2 图片上传组件（前端）

**components/product/admin/ImageUploader.tsx**:
```typescript
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

import { storageApi } from '@/lib/api/storage.api';
import { compressImage } from '@/lib/utils/image';

interface ImageUploaderProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
}

export function ImageUploader({
  value,
  onChange,
  multiple = false,
  maxFiles = 9,
  folder = 'products',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const images = Array.isArray(value) ? value : value ? [value] : [];

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxFiles) {
        toast({
          title: '错误',
          description: `最多只能上传${maxFiles}张图片`,
          variant: 'destructive',
        });
        return;
      }

      setUploading(true);
      setProgress(0);

      try {
        const uploadedUrls: string[] = [];

        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i];

          // 压缩图片
          const compressedFile = await compressImage(file, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.8,
          });

          // 上传到OSS
          const url = await storageApi.uploadImage(compressedFile, folder);
          uploadedUrls.push(url);

          // 更新进度
          setProgress(((i + 1) / acceptedFiles.length) * 100);
        }

        if (multiple) {
          onChange([...images, ...uploadedUrls]);
        } else {
          onChange(uploadedUrls[0]);
        }

        toast({
          title: '成功',
          description: `成功上传${uploadedUrls.length}张图片`,
        });
      } catch (error) {
        toast({
          title: '错误',
          description: '图片上传失败，请重试',
          variant: 'destructive',
        });
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [images, maxFiles, multiple, onChange, folder]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    multiple,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (index: number) => {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-4">
      {/* 已上传的图片 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <Card key={index} className="relative group">
              <div className="aspect-square relative">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover rounded"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 上传区域 */}
      {(!multiple || images.length < maxFiles) && (
        <Card
          {...getRootProps()}
          className={`border-2 border-dashed p-8 cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            {uploading ? (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4 animate-bounce" />
                <p className="text-sm text-gray-600 mb-4">上传中...</p>
                <Progress value={progress} className="w-full max-w-xs" />
              </>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  拖拽图片到此处，或点击上传
                </p>
                <p className="text-xs text-gray-400">
                  支持 JPG、PNG、WebP，最大5MB
                  {multiple && `，最多${maxFiles}张`}
                </p>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
```

---

### Day 18-19: AI内容生成后端

#### 18.1 FastAPI主应用

**app/main.py**:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import content_generation, translation, tasks
from app.core.config import settings
from app.core.logging import setup_logging

# 设置日志
setup_logging()

# 创建FastAPI应用
app = FastAPI(
    title="TradeCraft AI Service",
    description="AI服务：商品内容生成、翻译、图片处理",
    version="1.0.0",
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 路由
app.include_router(
    content_generation.router,
    prefix="/api/v1/content",
    tags=["Content Generation"],
)
app.include_router(
    translation.router,
    prefix="/api/v1/translation",
    tags=["Translation"],
)
app.include_router(
    tasks.router,
    prefix="/api/v1/tasks",
    tags=["Tasks"],
)

@app.get("/")
async def root():
    return {
        "service": "TradeCraft AI Service",
        "version": "1.0.0",
        "status": "running",
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

#### 18.2 内容生成服务

**app/services/content/generator.py**:
```python
import asyncio
from typing import Dict, List
from app.services.ai.wenxin_client import WenxinClient
from app.services.ai.glm_client import GLMClient
from app.services.translation.azure_translator import AzureTranslator
from app.services.content.validator import ContentValidator
from app.services.content.quality_checker import QualityChecker
from app.constants.prompts import PRODUCT_CONTENT_PROMPT_TEMPLATE

class ContentGenerator:
    """商品内容生成器"""

    def __init__(self):
        self.wenxin_client = WenxinClient()
        self.glm_client = GLMClient()
        self.azure_translator = AzureTranslator()
        self.validator = ContentValidator()
        self.quality_checker = QualityChecker()

    async def generate_multilingual_content(
        self,
        product_name: str,
        category: str,
        features: List[str],
        target_languages: List[str],
        market: str = "ID",
        target_audience: str = "adults",
        use_case: str = "general",
    ) -> Dict[str, Dict[str, any]]:
        """
        生成多语言商品内容

        Args:
            product_name: 商品名称（中文）
            category: 商品分类
            features: 核心特点列表
            target_languages: 目标语言列表 ["en", "id", "my"]
            market: 目标市场（ID=印尼，MY=马来西亚）
            target_audience: 目标人群
            use_case: 使用场景

        Returns:
            Dict[语言代码, 生成的内容]
        """

        # Step 1: 使用文心一言生成中文内容
        chinese_content = await self._generate_chinese_content(
            product_name=product_name,
            category=category,
            features=features,
            market=market,
            target_audience=target_audience,
            use_case=use_case,
        )

        # 验证中文内容
        self.validator.validate(chinese_content, "zh-CN")

        results = {
            "zh-CN": chinese_content,
        }

        # Step 2: 并行生成其他语言内容
        tasks = []
        for lang in target_languages:
            if lang == "zh-CN":
                continue
            elif lang == "en":
                # 英文直接使用GLM-4生成（成本更低）
                tasks.append(self._generate_english_content(chinese_content))
            else:
                # 其他语言通过Azure翻译
                tasks.append(self._translate_content(chinese_content, lang))

        translated_contents = await asyncio.gather(*tasks)

        # Step 3: 合并结果
        lang_index = 0
        for lang in target_languages:
            if lang == "zh-CN":
                continue
            results[lang] = translated_contents[lang_index]
            lang_index += 1

        # Step 4: 质量检查
        for lang, content in results.items():
            quality_score = self.quality_checker.check(content, lang)
            content["qualityScore"] = quality_score
            content["needsReview"] = quality_score < 85

        return results

    async def _generate_chinese_content(
        self,
        product_name: str,
        category: str,
        features: List[str],
        market: str,
        target_audience: str,
        use_case: str,
    ) -> Dict:
        """使用文心一言生成中文内容"""

        prompt = PRODUCT_CONTENT_PROMPT_TEMPLATE.format(
            product_name=product_name,
            category=category,
            features=", ".join(features),
            market="印尼" if market == "ID" else "马来西亚",
            target_audience=target_audience,
            use_case=use_case,
        )

        response = await self.wenxin_client.generate(prompt)
        return response

    async def _generate_english_content(self, chinese_content: Dict) -> Dict:
        """使用GLM-4生成英文内容"""

        prompt = f"""Translate the following Chinese e-commerce product content to English.
Keep the marketing tone and style appropriate for Southeast Asian markets (Indonesia, Malaysia).

Chinese content:
{chinese_content}

Generate the same structure in English with professional marketing copy.
Output in JSON format.
"""

        response = await self.glm_client.generate(prompt)
        return response

    async def _translate_content(self, content: Dict, target_lang: str) -> Dict:
        """使用Azure翻译内容"""

        translated = {}

        # 翻译各个字段
        translated["title"] = await self.azure_translator.translate(
            content["title"], "zh-CN", target_lang
        )
        translated["description"] = await self.azure_translator.translate(
            content["description"], "zh-CN", target_lang
        )
        translated["features"] = await asyncio.gather(*[
            self.azure_translator.translate(feature, "zh-CN", target_lang)
            for feature in content["features"]
        ])
        translated["keywords"] = await asyncio.gather(*[
            self.azure_translator.translate(keyword, "zh-CN", target_lang)
            for keyword in content["keywords"]
        ])
        translated["metaDescription"] = await self.azure_translator.translate(
            content["metaDescription"], "zh-CN", target_lang
        )

        return translated
```

#### 18.3 文心一言客户端

**app/services/ai/wenxin_client.py**:
```python
import json
import httpx
from typing import Dict
from app.core.config import settings
from app.core.logging import logger

class WenxinClient:
    """文心一言API客户端"""

    def __init__(self):
        self.api_key = settings.WENXIN_API_KEY
        self.secret_key = settings.WENXIN_SECRET_KEY
        self.base_url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop"
        self.access_token = None

    async def _get_access_token(self) -> str:
        """获取access_token"""
        if self.access_token:
            return self.access_token

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://aip.baidubce.com/oauth/2.0/token",
                params={
                    "grant_type": "client_credentials",
                    "client_id": self.api_key,
                    "client_secret": self.secret_key,
                },
            )
            result = response.json()
            self.access_token = result["access_token"]
            return self.access_token

    async def generate(self, prompt: str, temperature: float = 0.7) -> Dict:
        """生成内容"""

        access_token = await self._get_access_token()

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                params={"access_token": access_token},
                json={
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": temperature,
                    "response_format": {"type": "json_object"},
                },
            )

            result = response.json()

            if "error_code" in result:
                logger.error(f"Wenxin API error: {result}")
                raise Exception(f"Wenxin API error: {result['error_msg']}")

            content = json.loads(result["result"])
            return content
```

---

### Day 20: AI内容生成前端

**components/product/admin/AIContentGenerator.tsx**:
```typescript
'use client';

import { useState } from 'react';
import { Wand2, Loader2, Check, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

import { aiApi } from '@/lib/api/ai.api';
import { AIContentResponse } from '@/types/ai';

interface AIContentGeneratorProps {
  productId: number;
  productName: string;
  category: string;
  features: string[];
  onContentGenerated: (content: AIContentResponse) => void;
}

export function AIContentGenerator({
  productId,
  productName,
  category,
  features,
  onContentGenerated,
}: AIContentGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [result, setResult] = useState<AIContentResponse | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // 启动生成任务
      const response = await aiApi.generateContent({
        productId,
        productName,
        category,
        features,
        targetLanguages: ['en', 'id', 'my'],
        market: 'ID',
        targetAudience: 'adults',
        useCase: 'general',
      });

      setTaskId(response.data.taskId);

      // 轮询任务状态
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await aiApi.getTaskStatus(response.data.taskId);

          setProgress(statusResponse.data.progress);

          if (statusResponse.data.status === 'COMPLETED') {
            clearInterval(pollInterval);
            setIsGenerating(false);
            setResult(statusResponse.data.result);
            toast({
              title: '成功',
              description: 'AI内容生成完成',
            });
          } else if (statusResponse.data.status === 'FAILED') {
            clearInterval(pollInterval);
            setIsGenerating(false);
            toast({
              title: '错误',
              description: 'AI内容生成失败，请重试',
              variant: 'destructive',
            });
          }
        } catch (error) {
          clearInterval(pollInterval);
          setIsGenerating(false);
        }
      }, 3000); // 每3秒轮询一次

    } catch (error) {
      setIsGenerating(false);
      toast({
        title: '错误',
        description: '启动AI生成失败',
        variant: 'destructive',
      });
    }
  };

  const handleApply = () => {
    if (result) {
      onContentGenerated(result);
      setOpen(false);
      toast({
        title: '成功',
        description: 'AI生成内容已应用',
      });
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        AI生成多语言内容
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI内容生成</DialogTitle>
            <DialogDescription>
              使用AI自动生成英语、印尼语、马来语的商品营销内容
            </DialogDescription>
          </DialogHeader>

          {!result ? (
            <div className="space-y-6">
              {/* 生成配置 */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">商品名称</label>
                  <p className="text-sm text-gray-600">{productName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">分类</label>
                  <p className="text-sm text-gray-600">{category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">核心特点</label>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 生成进度 */}
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">正在生成内容...</span>
                  </div>
                  <Progress value={progress} />
                  <p className="text-xs text-gray-500 text-center">
                    预计需要30-60秒，请耐心等待
                  </p>
                </div>
              ) : (
                <Button onClick={handleGenerate} className="w-full">
                  开始生成
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* 生成结果 */}
              <Tabs defaultValue="en">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">英语</TabsTrigger>
                  <TabsTrigger value="id">印尼语</TabsTrigger>
                  <TabsTrigger value="my">马来语</TabsTrigger>
                </TabsList>

                {['en', 'id', 'my'].map((lang) => (
                  <TabsContent key={lang} value={lang} className="space-y-4">
                    {/* 质量评分 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">质量评分:</span>
                      <Badge variant={
                        result[lang].qualityScore >= 85 ? 'default' : 'secondary'
                      }>
                        {result[lang].qualityScore}/100
                      </Badge>
                      {result[lang].needsReview && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          需要人工审核
                        </Badge>
                      )}
                    </div>

                    {/* 标题 */}
                    <div>
                      <label className="text-sm font-medium">标题</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                        {result[lang].title}
                      </p>
                    </div>

                    {/* 描述 */}
                    <div>
                      <label className="text-sm font-medium">详细描述</label>
                      <div
                        className="text-sm mt-1 p-2 bg-gray-50 rounded prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: result[lang].description }}
                      />
                    </div>

                    {/* 卖点 */}
                    <div>
                      <label className="text-sm font-medium">商品卖点</label>
                      <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                        {result[lang].features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 关键词 */}
                    <div>
                      <label className="text-sm font-medium">SEO关键词</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result[lang].keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Meta描述 */}
                    <div>
                      <label className="text-sm font-medium">Meta描述</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                        {result[lang].metaDescription}
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              {/* 应用按钮 */}
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => handleGenerate()}>
                  重新生成
                </Button>
                <Button onClick={handleApply} className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  应用此内容
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## 📝 总结

以上是开发计划的前3周（Day 1-20）的详细内容，包括：

1. **项目初始化**（Day 1-2）
2. **数据库设计**（Day 3-5）
3. **Spring Boot基础架构**（Day 6-8）
4. **商品CRUD后端**（Day 11-12）
5. **商品管理前端**（Day 13-15）
6. **OSS存储集成**（Day 16-17）
7. **AI内容生成**（Day 18-20）

**下一部分将包含**：
- Week 5-6: 独立站前台基础
- Week 7-8: 用户与订单模块
- Week 9-10: 支付与物流集成
- Week 11-12: 数据分析与上线

需要我继续完成剩余部分吗？
