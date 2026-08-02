package com.ivion.main.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_chat_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 254)
    private String senderEmail;

    @Column(nullable = false, length = 80)
    private String senderName;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Column named system_message, not "system" — SYSTEM is a reserved word in MySQL 8+
    // (temporal table support), which broke both schema generation and every query.
    @Column(name = "system_message", nullable = false)
    private boolean systemMessage = false;
}
