package com.ivion.main.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final StringRedisTemplate redis;
    private static final String PREFIX = "jwt:blacklist:";

    public void blacklist(String token, Date expiry) {
        long ttlMs = expiry.getTime() - System.currentTimeMillis();
        if (ttlMs <= 0) return;
        try {
            redis.opsForValue().set(PREFIX + token, "1", Duration.ofMillis(ttlMs));
        } catch (Exception e) {
            log.error("[SECURITY] Redis unavailable — could not blacklist token: {}", e.getMessage());
        }
    }

    public boolean isBlacklisted(String token) {
        try {
            return Boolean.TRUE.equals(redis.hasKey(PREFIX + token));
        } catch (Exception e) {
            log.error("[SECURITY] Redis unavailable — blacklist check skipped: {}", e.getMessage());
            return false; // fail-open: token still expires at its own expiry time
        }
    }
}
