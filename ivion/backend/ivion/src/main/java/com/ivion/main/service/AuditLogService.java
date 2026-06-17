package com.ivion.main.service;

import com.ivion.main.entity.AuditLog;
import com.ivion.main.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository repository;

    public enum Action {
        LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_LOCKED,
        LOGOUT, REGISTER,
        ORDER_CREATED,
        ACCESS_DENIED
    }

    @Async
    public void log(Action action, String email, String ip, boolean success, String details) {
        try {
            repository.save(AuditLog.builder()
                    .timestamp(LocalDateTime.now())
                    .action(action.name())
                    .email(email)
                    .ip(ip)
                    .success(success)
                    .details(details)
                    .build());
        } catch (Exception e) {
            log.error("[AUDIT] Failed to save audit log: {}", e.getMessage());
        }
    }

    public static String resolveIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
