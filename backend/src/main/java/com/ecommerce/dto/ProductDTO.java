package com.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private String category;
    private String imageUrl;
    private String brand;
    private Double rating;
    private Integer reviewCount;
    private Boolean isActive;
    private Boolean isFeatured;
}
