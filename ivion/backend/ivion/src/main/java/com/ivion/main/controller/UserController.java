package com.ivion.main.controller;

import com.ivion.main.dto.RegisterRequest;
import com.ivion.main.dto.UserDTO;
import com.ivion.main.dto.UserUpdateRequest;
import com.ivion.main.service.ChatMessageService;
import com.ivion.main.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ChatMessageService chatMessageService;

    @GetMapping
    public List<UserDTO> getAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable Integer id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDTO> create(@Valid @RequestBody RegisterRequest request, Authentication authentication) {
        UserDTO created = userService.create(request);
        chatMessageService.logActivity(authentication.getName(), "creado", "usuario", created.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Integer id, @Valid @RequestBody UserUpdateRequest request, Authentication authentication) {
        UserDTO updated = userService.update(id, request);
        chatMessageService.logActivity(authentication.getName(), "modificado", "usuario", updated.getUsername());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, Authentication authentication) {
        String name = userService.findById(id).map(UserDTO::getUsername).orElse("#" + id);
        userService.delete(id, authentication.getName());
        chatMessageService.logActivity(authentication.getName(), "eliminado", "usuario", name);
        return ResponseEntity.noContent().build();
    }
}
