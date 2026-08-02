package com.ivion.main.dto;

import com.ivion.main.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ChatMessageDTO {

    private Long id;
    private String senderName;
    private String content;
    private LocalDateTime createdAt;

    public static ChatMessageDTO from(ChatMessage m) {
        return new ChatMessageDTO(m.getId(), m.getSenderName(), m.getContent(), m.getCreatedAt());
    }
}
