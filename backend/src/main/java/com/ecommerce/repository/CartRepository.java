package com.ecommerce.repository;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.User;
import com.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    
    void deleteByUser(User user);
    
    @Query("SELECT SUM(CASE WHEN ci.product.discountPrice IS NOT NULL THEN ci.product.discountPrice * ci.quantity ELSE ci.product.price * ci.quantity END) FROM CartItem ci WHERE ci.user = :user")
    Double getCartTotal(@Param("user") User user);
    
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.user = :user")
    Integer getCartItemCount(@Param("user") User user);
}
