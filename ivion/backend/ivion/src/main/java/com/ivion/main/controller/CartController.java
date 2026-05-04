package com.ivion.main.controller;

import com.ivion.main.dto.CartDTO;
import com.ivion.main.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable Integer userId) {
        return cartService.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/{userId}/add/{productId}")
    public CartDTO addProduct(@PathVariable Integer userId,
                              @PathVariable Integer productId,
                              @RequestParam(defaultValue = "1") int quantity) {
        return cartService.addProduct(userId, productId, quantity);
    }

    @DeleteMapping("/user/{userId}/remove/{productId}")
    public CartDTO removeProduct(@PathVariable Integer userId, @PathVariable Integer productId) {
        return cartService.removeProduct(userId, productId);
    }
}
