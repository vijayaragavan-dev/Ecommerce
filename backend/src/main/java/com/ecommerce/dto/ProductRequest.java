package com.ecommerce.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Double discountPrice;
    private Integer stockQuantity;
    private String category;
    private String imageUrl;
    private String brand;
    private Boolean isFeatured;
}
