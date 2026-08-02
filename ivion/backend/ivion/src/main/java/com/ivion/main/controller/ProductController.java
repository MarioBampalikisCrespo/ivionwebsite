package com.ivion.main.controller;

import com.ivion.main.dto.ProductDTO;
import com.ivion.main.dto.ProductRequest;
import com.ivion.main.service.ChatMessageService;
import com.ivion.main.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ChatMessageService chatMessageService;

    @GetMapping
    public List<ProductDTO> getAll() {
        return productService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getById(@PathVariable Integer id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductDTO> getByCategory(@PathVariable Integer categoryId) {
        return productService.findByCategoryId(categoryId);
    }

    @PostMapping
    public ResponseEntity<ProductDTO> create(@Valid @RequestBody ProductRequest request, Authentication authentication) {
        ProductDTO created = productService.create(request);
        chatMessageService.logActivity(authentication.getName(), "creado", "producto", created.getProductName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> update(@PathVariable Integer id, @Valid @RequestBody ProductRequest request, Authentication authentication) {
        ProductDTO updated = productService.update(id, request);
        chatMessageService.logActivity(authentication.getName(), "modificado", "producto", updated.getProductName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, Authentication authentication) {
        String name = productService.findById(id).map(ProductDTO::getProductName).orElse("#" + id);
        productService.delete(id);
        chatMessageService.logActivity(authentication.getName(), "eliminado", "producto", name);
        return ResponseEntity.noContent().build();
    }
}
