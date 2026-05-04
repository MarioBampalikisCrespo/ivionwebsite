package com.ivion.main.entity;

import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode
public class OrderProductId implements Serializable {

    private Integer orderId;
    private Integer productId;
}