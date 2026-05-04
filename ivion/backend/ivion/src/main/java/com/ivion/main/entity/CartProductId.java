package com.ivion.main.entity;

import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode
public class CartProductId implements Serializable {

    private Integer cartId;
    private Integer productId;
}