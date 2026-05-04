package com.ivion.main.repository;

import com.ivion.main.entity.CartProduct;
import com.ivion.main.entity.CartProductId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartProductRepository extends JpaRepository<CartProduct, CartProductId> {
    List<CartProduct> findByCartId(Integer cartId);
}