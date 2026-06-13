package com.ivion.main.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "productname", nullable = false)
    private String productName;

    @Column(name = "productdescription", nullable = false)
    private String productDescription;

    @Column(name = "productmemory", nullable = false)
    private String productMemory;

    @Column(name = "productstorage", nullable = false)
    private String productStorage;

    @Column(name = "productimage", nullable = false, length = 500)
    private String productImage;

    @Column(name = "productprice", nullable = false, precision = 10, scale = 2)
    private BigDecimal productPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryID")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colourID")
    private Colour colour;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<ProductVariant> variants;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<CartProduct> cartProducts;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<OrderProduct> orderProducts;
}
