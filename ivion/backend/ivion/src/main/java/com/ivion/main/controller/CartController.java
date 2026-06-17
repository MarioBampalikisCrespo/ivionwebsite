package com.ivion.main.controller;

import com.ivion.main.dto.CartDTO;
import com.ivion.main.security.SecurityUtil;
import com.ivion.main.service.CartService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Validated
public class CartController {

    private final CartService cartService;
    private final SecurityUtil securityUtil;

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable Integer userId) {
        securityUtil.requireOwnership(userId);
        return cartService.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/{userId}/add/{productId}")
    public CartDTO addProduct(@PathVariable Integer userId,
                              @PathVariable Integer productId,
                              @RequestParam(defaultValue = "1") @Min(1) @Max(99) int quantity,
                              @RequestParam(required = false) Integer variantId) {
        securityUtil.requireOwnership(userId);
        return cartService.addProduct(userId, productId, quantity, variantId);
    }

    @DeleteMapping("/user/{userId}/remove/{productId}")
    public CartDTO removeProduct(@PathVariable Integer userId, @PathVariable Integer productId) {
        securityUtil.requireOwnership(userId);
        return cartService.removeProduct(userId, productId);
    }
}
