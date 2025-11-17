package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIContentService {

    private final ProductRepository productRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${fastapi.base.url}")
    private String fastapiBaseUrl;

    public Map<String, Object> triggerContentGeneration(Long productId, List<String> targetLanguages) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

        // Prepare request for FastAPI
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("product_name", product.getNameZhCn());
        requestBody.put("category", product.getCategory().getNameEn()); // Assuming English name
        requestBody.put("features", product.getFeaturesZhCn());
        requestBody.put("target_languages", targetLanguages);

        String url = fastapiBaseUrl + "/api/v1/generate-content";

        // Call FastAPI service
        // In a real app, this would be an async call pushed to a Redis queue
        try {
            Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);
            // Here you would process the response and update the product entity
            // For now, we just return the response
            System.out.println("Received from FastAPI: " + response);
            return response;
        } catch (Exception e) {
            System.err.println("Error calling FastAPI service: " + e.getMessage());
            throw new RuntimeException("Failed to generate AI content", e);
        }
    }
}
