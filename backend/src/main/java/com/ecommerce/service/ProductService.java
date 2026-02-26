package com.ecommerce.service;

import com.ecommerce.dto.ProductDTO;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public Page<ProductDTO> getAllProducts(int page, int size, String sortBy, String sortDir) {
        log.debug("Fetching all products - page: {}, size: {}, sortBy: {}, sortDir: {}", page, size, sortBy, sortDir);
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ProductDTO> products = productRepository.findByIsActiveTrue(pageable)
            .map(this::convertToDTO);
        log.debug("Found {} products", products.getTotalElements());
        return products;
    }
    
    public Page<ProductDTO> getProductsByCategory(String category, int page, int size) {
        log.debug("Fetching products by category: {} - page: {}, size: {}", category, page, size);
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategoryAndIsActiveTrue(category, pageable)
            .map(this::convertToDTO);
    }
    
    public Page<ProductDTO> searchProducts(String query, int page, int size) {
        log.debug("Searching products: {} - page: {}, size: {}", query, page, size);
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchProducts(query, pageable)
            .map(this::convertToDTO);
    }
    
    public List<ProductDTO> getFeaturedProducts() {
        log.debug("Fetching featured products");
        return productRepository.findFeaturedProducts().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public ProductDTO getProductById(Long id) {
        log.debug("Fetching product by id: {}", id);
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDTO(product);
    }
    
    public List<String> getAllCategories() {
        log.debug("Fetching all categories");
        return productRepository.findAllCategories();
    }
    
    @Transactional
    public ProductDTO createProduct(ProductRequest request) {
        log.info("Creating new product: {}", request.getName());
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(BigDecimal.valueOf(request.getPrice()));
        if (request.getDiscountPrice() != null) {
            product.setDiscountPrice(BigDecimal.valueOf(request.getDiscountPrice()));
        }
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        product.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        product.setIsActive(true);
        
        Product saved = productRepository.save(product);
        log.info("Product created with id: {}", saved.getId());
        return convertToDTO(saved);
    }
    
    @Transactional
    public ProductDTO updateProduct(Long id, ProductRequest request) {
        log.info("Updating product: {}", id);
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(BigDecimal.valueOf(request.getPrice()));
        if (request.getDiscountPrice() != null) {
            product.setDiscountPrice(BigDecimal.valueOf(request.getDiscountPrice()));
        }
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        if (request.getIsFeatured() != null) {
            product.setIsFeatured(request.getIsFeatured());
        }
        
        Product updated = productRepository.save(product);
        log.info("Product updated: {}", id);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product: {}", id);
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsActive(false);
        productRepository.save(product);
        log.info("Product deleted (soft): {}", id);
    }
    
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice().doubleValue());
        if (product.getDiscountPrice() != null) {
            dto.setDiscountPrice(product.getDiscountPrice().doubleValue());
        }
        dto.setStockQuantity(product.getStockQuantity());
        dto.setCategory(product.getCategory());
        dto.setImageUrl(product.getImageUrl());
        dto.setBrand(product.getBrand());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setIsActive(product.getIsActive());
        dto.setIsFeatured(product.getIsFeatured());
        return dto;
    }
}
