package com.ivion.main.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_company_id", nullable = false)
    private ShippingCompany shippingCompany;

    @Column(name = "shipment_address")
    private String shipmentAddress;

    @Column(name = "shipment_date")
    private LocalDateTime shipmentDate;

    @Column(name = "shipment_state")
    private String shipmentState;
}
