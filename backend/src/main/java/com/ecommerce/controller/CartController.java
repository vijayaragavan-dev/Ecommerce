package com.ecommerce.controller;

import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    
    private final CartService cartService;
    
    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCartItems(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCartItems(authentication.getName()));
    }
    
    @GetMapping("/total")
    public ResponseEntity<Map<String, Double>> getCartTotal(Authentication authentication) {
        return ResponseEntity.ok(Map.of("total", cartService.getCartTotal(authentication.getName())));
    }
    
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getCartCount(Authentication authentication) {
        return ResponseEntity.ok(Map.of("count", cartService.getCartItemCount(authentication.getName())));
    }
    
    @PostMapping("/add")
    public ResponseEntity<CartItemDTO> addToCart(
        Authentication authentication,
        @RequestParam Long productId,
        @RequestParam(defaultValue = "1") Integer quantity
    ) {
        return ResponseEntity.ok(cartService.addToCart(authentication.getName(), productId, quantity));
    }
    
    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItemDTO> updateCartItem(
        @PathVariable Long cartItemId,
        @RequestParam Integer quantity
    ) {
        return ResponseEntity.ok(cartService.updateCartItem(cartItemId, quantity));
    }
    
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartItemId) {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok().build();
    }
}
