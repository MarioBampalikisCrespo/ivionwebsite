package com.ivion.main.dto;

import com.ivion.main.entity.OrderProduct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class OrderItemDTO {

    private ProductDTO product;
    private Integer quantity;
    private BigDecimal unityPrice;

    public static OrderItemDTO from(OrderProduct op) {
        return new OrderItemDTO(ProductDTO.from(op.getProduct()), op.getQuantity(), op.getUnityPrice());
    }
}
