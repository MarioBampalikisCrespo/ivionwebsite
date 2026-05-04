package com.ivion.main.controller;

import com.ivion.main.dto.OrderDTO;
import com.ivion.main.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/user/{userId}")
    public List<OrderDTO> getByUser(@PathVariable Integer userId) {
        return orderService.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getById(@PathVariable Integer id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/{userId}/checkout")
    public OrderDTO checkout(@PathVariable Integer userId,
                             @RequestBody Map<String, String> body) {
        return orderService.createFromCart(userId, body.get("shipmentAddress"));
    }
}
