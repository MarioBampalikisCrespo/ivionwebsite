package com.ivion.main.service;

import com.ivion.main.dto.ChatMessageDTO;
import com.ivion.main.dto.ChatMessageRequest;
import java.util.List;

public interface ChatMessageService {
    List<ChatMessageDTO> findRecent();
    ChatMessageDTO send(String senderEmail, String senderName, ChatMessageRequest request);
    void logActivity(String actorEmail, String action, String targetType, String targetName);
}
