package com.ivion.main.controller;

import com.ivion.main.dto.CheckoutRequest;
import com.ivion.main.dto.OrderDTO;
import com.ivion.main.security.SecurityUtil;
import com.ivion.main.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final SecurityUtil securityUtil;

    @GetMapping("/user/{userId}")
    public List<OrderDTO> getByUser(@PathVariable Integer userId) {
        securityUtil.requireOwnership(userId);
        return orderService.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getById(@PathVariable Integer id) {
        Integer currentUserId = securityUtil.getCurrentUser().getId();
        return orderService.findByIdAndUserId(id, currentUserId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/{userId}/checkout")
    public OrderDTO checkout(@PathVariable Integer userId,
                             @Valid @RequestBody CheckoutRequest body) {
        securityUtil.requireOwnership(userId);
        return orderService.createFromCart(userId, body.getShipmentAddress());
    }
}
