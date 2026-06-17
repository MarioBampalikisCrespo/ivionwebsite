package com.ivion.main.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(length = 254)
    private String email;

    @Column(length = 45)
    private String ip;

    @Column(nullable = false)
    private boolean success;

    @Column(length = 500)
    private String details;
}
