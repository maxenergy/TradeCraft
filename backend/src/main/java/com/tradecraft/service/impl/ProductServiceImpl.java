package com.tradecraft.service.impl;

import com.tradecraft.dto.response.ProductResponse;
import com.tradecraft.entity.Product;
import com.tradecraft.entity.enums.ProductStatus;
import com.tradecraft.exception.InsufficientStockException;
import com.tradecraft.exception.ResourceNotFoundException;
import com.tradecraft.repository.ProductRepository;
import com.tradecraft.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 产品服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    @Transactional
    public ProductResponse createProduct(Product product) {
        log.info("Creating new product with SKU: {}", product.getSku());

        // 检查SKU是否已存在
        if (product.getSku() != null && productRepository.findBySku(product.getSku()).isPresent()) {
            throw new IllegalArgumentException("Product with SKU " + product.getSku() + " already exists");
        }

        product = productRepository.save(product);
        log.info("Product created successfully: {}", product.getId());

        return mapToProductResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, Product updatedProduct) {
        log.info("Updating product: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        // 更新产品信息
        if (updatedProduct.getNameZhCn() != null) {
            product.setNameZhCn(updatedProduct.getNameZhCn());
        }
        if (updatedProduct.getNameEn() != null) {
            product.setNameEn(updatedProduct.getNameEn());
        }
        if (updatedProduct.getNameId() != null) {
            product.setNameId(updatedProduct.getNameId());
        }
        if (updatedProduct.getDescriptionZhCn() != null) {
            product.setDescriptionZhCn(updatedProduct.getDescriptionZhCn());
        }
        if (updatedProduct.getDescriptionEn() != null) {
            product.setDescriptionEn(updatedProduct.getDescriptionEn());
        }
        if (updatedProduct.getDescriptionId() != null) {
            product.setDescriptionId(updatedProduct.getDescriptionId());
        }
        if (updatedProduct.getPriceCny() != null) {
            product.setPriceCny(updatedProduct.getPriceCny());
        }
        if (updatedProduct.getPriceUsd() != null) {
            product.setPriceUsd(updatedProduct.getPriceUsd());
        }
        if (updatedProduct.getPriceIdr() != null) {
            product.setPriceIdr(updatedProduct.getPriceIdr());
        }
        if (updatedProduct.getPriceMyr() != null) {
            product.setPriceMyr(updatedProduct.getPriceMyr());
        }
        if (updatedProduct.getStockQuantity() != null) {
            product.setStockQuantity(updatedProduct.getStockQuantity());
        }
        if (updatedProduct.getStatus() != null) {
            product.setStatus(updatedProduct.getStatus());
        }

        product = productRepository.save(product);
        log.info("Product updated successfully: {}", product.getId());

        return mapToProductResponse(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        productRepository.delete(product);
        log.info("Product deleted successfully: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToProductResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "sku", sku));
        return mapToProductResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::mapToProductResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndStatus(categoryId, ProductStatus.ACTIVE, pageable)
                .map(this::mapToProductResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByIsFeaturedTrueAndStatus(ProductStatus.ACTIVE, pageable)
                .map(this::mapToProductResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByPriceRange(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        return productRepository.findByPriceRange(minPrice, maxPrice, ProductStatus.ACTIVE, pageable)
                .map(this::mapToProductResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchByKeyword(keyword, ProductStatus.ACTIVE, pageable)
                .map(this::mapToProductResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStockProducts(int threshold) {
        return productRepository.findLowStockProducts(threshold)
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void decreaseStock(Long productId, int quantity) {
        log.info("Decreasing stock for product {}: {} units", productId, quantity);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (!product.hasStock(quantity)) {
            throw new InsufficientStockException(
                    productId,
                    quantity,
                    product.getStockQuantity()
            );
        }

        product.decreaseStock(quantity);
        productRepository.save(product);

        log.info("Stock decreased successfully for product {}", productId);
    }

    @Override
    @Transactional
    public void increaseStock(Long productId, int quantity) {
        log.info("Increasing stock for product {}: {} units", productId, quantity);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        product.increaseStock(quantity);
        productRepository.save(product);

        log.info("Stock increased successfully for product {}", productId);
    }

    @Override
    @Transactional
    public void updateProductStatus(Long productId, ProductStatus status) {
        log.info("Updating product {} status to {}", productId, status);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        product.setStatus(status);
        productRepository.save(product);

        log.info("Product status updated successfully");
    }

    /**
     * 将Product实体映射为ProductResponse
     */
    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .sku(product.getSku())
                .nameZhCn(product.getNameZhCn())
                .nameEn(product.getNameEn())
                .nameId(product.getNameId())
                .descriptionZhCn(product.getDescriptionZhCn())
                .descriptionEn(product.getDescriptionEn())
                .descriptionId(product.getDescriptionId())
                .priceCny(product.getPriceCny())
                .priceUsd(product.getPriceUsd())
                .priceIdr(product.getPriceIdr())
                .priceMyr(product.getPriceMyr())
                .stockQuantity(product.getStockQuantity())
                .status(product.getStatus().name())
                .isFeatured(product.getIsFeatured())
                .images(product.getImages())
                .tags(product.getTags())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
