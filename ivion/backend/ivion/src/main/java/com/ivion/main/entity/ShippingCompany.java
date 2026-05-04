package com.ivion.main.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "shipping_companies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ShippingCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "shipping_company_name", nullable = false)
    private String shippingCompanyName;

    @OneToMany(mappedBy = "shippingCompany", fetch = FetchType.LAZY)
    private List<Shipment> shipments;
}
