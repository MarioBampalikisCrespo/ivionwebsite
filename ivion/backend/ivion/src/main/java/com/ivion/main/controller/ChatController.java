package com.ivion.main.controller;

import com.ivion.main.dto.ChatMessageDTO;
import com.ivion.main.dto.ChatMessageRequest;
import com.ivion.main.entity.User;
import com.ivion.main.exception.ResourceNotFoundException;
import com.ivion.main.repository.UserRepository;
import com.ivion.main.service.ChatMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final UserRepository userRepository;

    @GetMapping("/messages")
    public List<ChatMessageDTO> getMessages() {
        return chatMessageService.findRecent();
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatMessageDTO> send(@Valid @RequestBody ChatMessageRequest request,
                                               Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatMessageService.send(user.getEmail(), user.getUsername(), request));
    }
}
