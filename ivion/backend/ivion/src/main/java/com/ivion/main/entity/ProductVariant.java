package com.ivion.main.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "chip")
    private String chip;

    @Column(name = "screen_size")
    private String screenSize;

    @Column(name = "storage", nullable = false)
    private String storage;

    @Column(name = "memory", nullable = false)
    private String memory;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}
