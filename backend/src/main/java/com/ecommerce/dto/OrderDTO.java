package com.ecommerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private List<OrderItemDTO> items;
    private Double totalAmount;
    private String status;
    private String shippingAddress;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String phone;
    private String createdAt;
}
