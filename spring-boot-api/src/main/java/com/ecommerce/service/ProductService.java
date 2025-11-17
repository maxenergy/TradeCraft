package com.ecommerce.service;

import com.ecommerce.dto.product.ProductCreateDTO;
import com.ecommerce.dto.product.ProductViewDTO;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    // private final ProductMapper productMapper; // Will be added later

    @Transactional
    public ProductViewDTO createProduct(ProductCreateDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Product product = new Product();
        // In a real project, this mapping would be done by a mapper like MapStruct
        product.setCategory(category);
        product.setNameZhCn(dto.getNameZhCn());
        // Set placeholder names for other languages
        product.setNameEn("English Name Placeholder");
        product.setNameId("Indonesian Name Placeholder");
        product.setNameMy("Malaysian Name Placeholder");
        product.setNameZhTw("Traditional Chinese Name Placeholder");

        product.setDescriptionZhCn(dto.getDescriptionZhCn());
        product.setFeaturesZhCn(dto.getFeaturesZhCn());
        product.setPriceCny(dto.getPriceCny());
        product.setCostPriceCny(dto.getCostPriceCny());
        product.setStock(dto.getStock());
        product.setImages(dto.getImages());
        product.setWeightGrams(dto.getWeightGrams());
        product.setDimensions(dto.getDimensions());

        // Generate a unique SKU
        String sku = "PROD-" + UUID.randomUUID().toString().toUpperCase().substring(0, 8);
        product.setSku(sku);
        product.setStatus("DRAFT");

        Product savedProduct = productRepository.save(product);

        // Manual mapping to DTO for now
        ProductViewDTO viewDTO = new ProductViewDTO();
        viewDTO.setId(savedProduct.getId());
        viewDTO.setCategoryId(savedProduct.getCategory().getId());
        viewDTO.setCategoryName(savedProduct.getCategory().getNameEn()); // Assuming English name for now
        viewDTO.setSku(savedProduct.getSku());
        viewDTO.setNameZhCn(savedProduct.getNameZhCn());
        viewDTO.setStatus(savedProduct.getStatus());
        viewDTO.setCreatedAt(savedProduct.getCreatedAt());

        return viewDTO;
    }

    // Placeholder for other CRUD methods
}
