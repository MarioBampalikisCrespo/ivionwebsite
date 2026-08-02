package com.ivion.main.service.impl;

import com.ivion.main.dto.ChatMessageDTO;
import com.ivion.main.dto.ChatMessageRequest;
import com.ivion.main.entity.ChatMessage;
import com.ivion.main.repository.ChatMessageRepository;
import com.ivion.main.service.ChatMessageService;
import com.ivion.main.util.SanitizationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

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
}
