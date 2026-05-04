package com.ivion.main.dto;

import com.ivion.main.entity.CartProduct;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CartItemDTO {

    private ProductDTO product;
    private Integer quantity;

    public static CartItemDTO from(CartProduct cp) {
        return new CartItemDTO(ProductDTO.from(cp.getProduct()), cp.getQuantity());
    }
}
