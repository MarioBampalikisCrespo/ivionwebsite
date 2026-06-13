package com.ivion.main.service.impl;

import com.ivion.main.dto.CartDTO;
import com.ivion.main.dto.CartItemDTO;
import com.ivion.main.entity.*;
import com.ivion.main.exception.ResourceNotFoundException;
import com.ivion.main.repository.*;
import com.ivion.main.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartProductRepository cartProductRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    @Transactional(readOnly = true)
    public Optional<CartDTO> findByUserId(Integer userId) {
        return cartRepository.findByUserId(userId).map(cart -> {
            List<CartItemDTO> items = cartProductRepository.findByCartId(cart.getId())
                    .stream().map(CartItemDTO::from).collect(Collectors.toList());
            return CartDTO.from(cart, items);
        });
    }

    @Override
    @Transactional
    public CartDTO addProduct(Integer userId, Integer productId, int quantity, Integer variantId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado para el usuario " + userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + productId));

        CartProductId cpId = new CartProductId(cart.getId(), productId);
        CartProduct cp = cartProductRepository.findById(cpId)
                .orElse(new CartProduct(cpId, cart, product, 0, variantId));
        cp.setQuantity(cp.getQuantity() + quantity);
        if (variantId != null) cp.setVariantId(variantId);
        cartProductRepository.save(cp);

        recalculateTotal(cart);
        cartRepository.save(cart);

        List<CartItemDTO> items = cartProductRepository.findByCartId(cart.getId())
                .stream().map(CartItemDTO::from).collect(Collectors.toList());
        return CartDTO.from(cart, items);
    }

    @Override
    @Transactional
    public CartDTO removeProduct(Integer userId, Integer productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado para el usuario " + userId));

        cartProductRepository.deleteById(new CartProductId(cart.getId(), productId));
        recalculateTotal(cart);
        cartRepository.save(cart);

        List<CartItemDTO> items = cartProductRepository.findByCartId(cart.getId())
                .stream().map(CartItemDTO::from).collect(Collectors.toList());
        return CartDTO.from(cart, items);
    }

    private void recalculateTotal(Cart cart) {
        BigDecimal total = cartProductRepository.findByCartId(cart.getId()).stream()
                .map(cp -> {
                    BigDecimal unitPrice = (cp.getVariantId() != null)
                            ? productVariantRepository.findById(cp.getVariantId())
                                .map(ProductVariant::getPrice)
                                .orElse(cp.getProduct().getProductPrice())
                            : cp.getProduct().getProductPrice();
                    return unitPrice.multiply(BigDecimal.valueOf(cp.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotal(total);
    }
}
