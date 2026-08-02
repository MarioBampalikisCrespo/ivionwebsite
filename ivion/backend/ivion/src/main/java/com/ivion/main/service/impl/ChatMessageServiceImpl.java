package com.ivion.main.service.impl;

import com.ivion.main.dto.ChatMessageDTO;
import com.ivion.main.dto.ChatMessageRequest;
import com.ivion.main.entity.ChatMessage;
import com.ivion.main.entity.User;
import com.ivion.main.repository.ChatMessageRepository;
import com.ivion.main.repository.UserRepository;
import com.ivion.main.service.ChatMessageService;
import com.ivion.main.util.SanitizationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private static final DateTimeFormatter LOG_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy // HH:mm:ss");

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> findRecent() {
        return chatMessageRepository.findTop100ByOrderByCreatedAtAsc().stream()
                .map(ChatMessageDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChatMessageDTO send(String senderEmail, String senderName, ChatMessageRequest request) {
        ChatMessage message = new ChatMessage();
        message.setSenderEmail(senderEmail);
        message.setSenderName(senderName);
        message.setContent(SanitizationUtil.sanitize(request.getContent()));
        message.setCreatedAt(LocalDateTime.now());
        chatMessageRepository.save(message);
        return ChatMessageDTO.from(message);
    }

    @Override
    @Transactional
    public void logActivity(String actorEmail, String action, String targetType, String targetName) {
        try {
            String actorName = userRepository.findByEmail(actorEmail)
                    .map(User::getUsername)
                    .orElse(actorEmail);
            LocalDateTime now = LocalDateTime.now();
            String content = String.format("%s -- %s ha %s el %s '%s'",
                    now.format(LOG_FORMAT), actorName, action, targetType, targetName);

            ChatMessage message = new ChatMessage();
            message.setSenderEmail(actorEmail);
            message.setSenderName(actorName);
            message.setContent(content);
            message.setCreatedAt(now);
            message.setSystemMessage(true);
            chatMessageRepository.save(message);
        } catch (Exception ignored) {
            // best-effort — a logging failure must never break the product/user operation
        }
    }
}
