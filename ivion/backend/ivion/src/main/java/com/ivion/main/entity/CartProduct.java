package com.ivion.main.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_product")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CartProduct {

    @EmbeddedId
    private CartProductId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("cartId")
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;
}
