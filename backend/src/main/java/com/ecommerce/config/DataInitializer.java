package com.ecommerce.config;

import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setEmail("admin@ecommerce.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            
            User user = new User();
            user.setEmail("user@ecommerce.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFirstName("John");
            user.setLastName("Doe");
            user.setRole(User.Role.USER);
            userRepository.save(user);
            
            log.info("Default users created");
        }
        
        if (productRepository.count() == 0) {
            List<Product> products = Arrays.asList(
                createProduct("Premium Wireless Headphones", "High-quality wireless headphones with noise cancellation", 
                    299.99, 249.99, 50, "Electronics", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", "Sony", true),
                createProduct("Smart Watch Pro", "Advanced smartwatch with health monitoring", 
                    399.99, 349.99, 30, "Electronics", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", "Apple", true),
                createProduct("Running Shoes Ultra", "Comfortable running shoes for athletes", 
                    149.99, 119.99, 100, "Sportswear", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", "Nike", true),
                createProduct("Designer Sunglasses", "Premium polarized sunglasses", 
                    199.99, 149.99, 75, "Accessories", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", "Ray-Ban", false),
                createProduct("Leather Laptop Bag", "Genuine leather messenger bag", 
                    179.99, 149.99, 40, "Accessories", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500", "Hugo Boss", false),
                createProduct("Wireless Earbuds", "True wireless earbuds with premium sound", 
                    199.99, 169.99, 80, "Electronics", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500", "Samsung", true),
                createProduct("Fitness Tracker Band", "Water-resistant fitness band", 
                    79.99, 59.99, 120, "Electronics", "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500", "Fitbit", false),
                createProduct("Denim Jacket Classic", "Vintage style denim jacket", 
                    129.99, 99.99, 60, "Clothing", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500", "Levi's", false),
                createProduct("Mechanical Keyboard", "RGB mechanical gaming keyboard", 
                    159.99, 129.99, 45, "Electronics", "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500", "Corsair", false),
                createProduct("Yoga Mat Premium", "Non-slip eco-friendly yoga mat", 
                    49.99, 39.99, 200, "Sportswear", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500", "Lululemon", false),
                createProduct("Casual T-Shirt Pack", "Pack of 3 premium cotton t-shirts", 
                    59.99, 49.99, 150, "Clothing", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", "H&M", false),
                createProduct("Bluetooth Speaker", "Portable waterproof speaker", 
                    89.99, 69.99, 90, "Electronics", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", "JBL", true)
            );
            
            productRepository.saveAll(products);
            log.info("Sample products created");
        }
    }
    
    private Product createProduct(String name, String description, double price, double discountPrice, 
        int stock, String category, String imageUrl, String brand, boolean featured) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(BigDecimal.valueOf(price));
        product.setDiscountPrice(BigDecimal.valueOf(discountPrice));
        product.setStockQuantity(stock);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        product.setBrand(brand);
        product.setIsFeatured(featured);
        product.setRating(4.5);
        product.setReviewCount(100);
        return product;
    }
}
