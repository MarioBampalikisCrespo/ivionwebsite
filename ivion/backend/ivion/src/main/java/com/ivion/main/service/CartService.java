package com.ivion.main.service;

import com.ivion.main.dto.CartDTO;
import java.util.Optional;

public interface CartService {
    Optional<CartDTO> findByUserId(Integer userId);
    CartDTO addProduct(Integer userId, Integer productId, int quantity, Integer variantId);
    CartDTO removeProduct(Integer userId, Integer productId);
}
