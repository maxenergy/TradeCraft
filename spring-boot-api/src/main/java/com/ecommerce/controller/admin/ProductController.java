package com.ecommerce.controller.admin;

import com.ecommerce.dto.product.ProductCreateDTO;
import com.ecommerce.dto.product.ProductViewDTO;
import com.ecommerce.service.AIContentService;
import com.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final AIContentService aiContentService;

    @PostMapping
    public ResponseEntity<ProductViewDTO> createProduct(@Valid @RequestBody ProductCreateDTO createDTO) {
        ProductViewDTO createdProduct = productService.createProduct(createDTO);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/generate-content")
    public ResponseEntity<Map<String, Object>> generateContent(
            @PathVariable Long id,
            @RequestBody List<String> targetLanguages) {
        Map<String, Object> generatedContent = aiContentService.triggerContentGeneration(id, targetLanguages);
        return ResponseEntity.ok(generatedContent);
    }

    // Placeholder for other endpoints
}
