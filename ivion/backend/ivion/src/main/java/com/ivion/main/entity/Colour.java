package com.ivion.main.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "colours")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Colour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "colourname", nullable = false)
    private String colourName;

    @OneToMany(mappedBy = "colour", fetch = FetchType.LAZY)
    private List<Product> products;
}
