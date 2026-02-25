package com.ecommerce.service;

import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    public List<CartItemDTO> getCartItems(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return cartRepository.findByUser(user).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public Double getCartTotal(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Double total = cartRepository.getCartTotal(user);
        return total != null ? total : 0.0;
    }
    
    public Integer getCartItemCount(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return cartRepository.getCartItemCount(user);
    }
    
    @Transactional
    public CartItemDTO addToCart(String email, Long productId, Integer quantity) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }
        
        CartItem cartItem = cartRepository.findByUserAndProduct(user, product)
            .orElse(new CartItem(user, product, 0));
        
        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        CartItem saved = cartRepository.save(cartItem);
        
        return convertToDTO(saved);
    }
    
    @Transactional
    public CartItemDTO updateCartItem(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartRepository.findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (cartItem.getProduct().getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }
        
        cartItem.setQuantity(quantity);
        CartItem updated = cartRepository.save(cartItem);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void removeFromCart(Long cartItemId) {
        cartRepository.deleteById(cartItemId);
    }
    
    @Transactional
    public void clearCart(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        cartRepository.deleteByUser(user);
    }
    
    private CartItemDTO convertToDTO(CartItem cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId());
        dto.setProductId(cartItem.getProduct().getId());
        dto.setProductName(cartItem.getProduct().getName());
        dto.setProductImage(cartItem.getProduct().getImageUrl());
        dto.setPrice(cartItem.getProduct().getPrice().doubleValue());
        if (cartItem.getProduct().getDiscountPrice() != null) {
            dto.setDiscountPrice(cartItem.getProduct().getDiscountPrice().doubleValue());
        }
        dto.setQuantity(cartItem.getQuantity());
        
        double itemPrice = cartItem.getProduct().getDiscountPrice() != null 
            ? cartItem.getProduct().getDiscountPrice().doubleValue() 
            : cartItem.getProduct().getPrice().doubleValue();
        dto.setTotal(itemPrice * cartItem.getQuantity());
        
        return dto;
    }
}
