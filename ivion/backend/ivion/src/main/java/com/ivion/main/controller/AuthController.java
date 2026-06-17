package com.ivion.main.controller;

import com.ivion.main.dto.AuthResponse;
import com.ivion.main.dto.LoginRequest;
import com.ivion.main.dto.RegisterRequest;
import com.ivion.main.dto.UserDTO;
import com.ivion.main.repository.UserRepository;
import com.ivion.main.security.JwtUtil;
import com.ivion.main.service.AuditLogService;
import com.ivion.main.service.AuditLogService.Action;
import com.ivion.main.service.AuthService;
import com.ivion.main.service.TokenBlacklistService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService           authService;
    private final UserRepository        userRepository;
    private final TokenBlacklistService tokenBlacklist;
    private final AuditLogService       auditLog;
    private final JwtUtil               jwtUtil;

    private static final int COOKIE_MAX_AGE = 86400;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegisterRequest request,
                                            HttpServletRequest httpRequest,
                                            HttpServletResponse response) {
        AuthResponse auth = authService.register(request);
        setJwtCookie(response, auth.getToken());
        auditLog.log(Action.REGISTER, request.getEmail(), AuditLogService.resolveIp(httpRequest), true, null);
        return ResponseEntity.ok(auth.getUser());
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@Valid @RequestBody LoginRequest request,
                                         HttpServletRequest httpRequest,
                                         HttpServletResponse response) {
        String ip = AuditLogService.resolveIp(httpRequest);
        try {
            AuthResponse auth = authService.login(request);
            setJwtCookie(response, auth.getToken());
            auditLog.log(Action.LOGIN_SUCCESS, request.getEmail(), ip, true, null);
            return ResponseEntity.ok(auth.getUser());
        } catch (ResponseStatusException e) {
            String reason = e.getReason() != null ? e.getReason() : e.getMessage();
            boolean locked = reason != null && reason.contains("bloqueada");
            auditLog.log(locked ? Action.LOGIN_LOCKED : Action.LOGIN_FAILURE,
                    request.getEmail(), ip, false, reason);
            throw e;
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        return userRepository.findByEmail(authentication.getName())
                .map(user -> ResponseEntity.ok(UserDTO.from(user)))
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request,
                                       HttpServletResponse response,
                                       Authentication authentication) {
        // Blacklist the JWT so it cannot be reused even if someone captured it
        extractJwtFromCookies(request).ifPresent(token -> {
            try {
                tokenBlacklist.blacklist(token, jwtUtil.extractExpiration(token));
            } catch (Exception ignored) {}
        });

        clearJwtCookie(response);
        String email = authentication != null ? authentication.getName() : "unknown";
        auditLog.log(Action.LOGOUT, email, AuditLogService.resolveIp(request), true, null);
        return ResponseEntity.ok().build();
    }

    private java.util.Optional<String> extractJwtFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return java.util.Optional.empty();
        for (Cookie c : request.getCookies()) {
            if ("jwt".equals(c.getName())) return java.util.Optional.of(c.getValue());
        }
        return java.util.Optional.empty();
    }

    private void setJwtCookie(HttpServletResponse response, String token) {
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie("jwt", token, COOKIE_MAX_AGE));
    }

    private void clearJwtCookie(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie("jwt", "", 0));
    }

    private String buildCookie(String name, String value, int maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .maxAge(maxAge)
                .path("/")
                .build()
                .toString();
    }
}
