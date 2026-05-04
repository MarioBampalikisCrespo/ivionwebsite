package com.ivion.main.dto;

import com.ivion.main.entity.Cart;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class CartDTO {

    private Integer id;
    private BigDecimal total;
    private List<CartItemDTO> items;

    public static CartDTO from(Cart c, List<CartItemDTO> items) {
        return new CartDTO(c.getId(), c.getTotal(), items);
    }
}
