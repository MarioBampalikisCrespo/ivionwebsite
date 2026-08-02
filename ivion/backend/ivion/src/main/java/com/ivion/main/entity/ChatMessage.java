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
    // Explicit DEFAULT so ALTER TABLE ADD COLUMN ... NOT NULL succeeds on Postgres even
    // when the table already has rows (Postgres refuses a NOT NULL add with no default
    // otherwise); works the same way on MySQL since it also accepts DEFAULT FALSE.
    @Column(name = "system_message", nullable = false, columnDefinition = "boolean not null default false")
    private boolean systemMessage = false;
}
