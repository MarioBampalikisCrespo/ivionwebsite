package com.ivion.main.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    private static final String DEV_FALLBACK = "dev-only-secret-must-be-overridden-in-production";

    @PostConstruct
    public void validateSecret() {
        if (secret.length() < 32) {
            throw new IllegalStateException(
                "jwt.secret must be at least 32 characters. Set the JWT_SECRET environment variable.");
        }
        if (secret.contains(DEV_FALLBACK)) {
            boolean isProd = activeProfile.contains("prod");
            if (isProd) {
                throw new IllegalStateException(
                    "[SECURITY] JWT_SECRET is using the dev fallback in a production profile. " +
                    "Generate a secret with: openssl rand -base64 64");
            }
            log.warn("[SECURITY] JWT_SECRET is using the dev fallback. " +
                     "Set the JWT_SECRET env var before deploying to production.");
        }
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public Date extractExpiration(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String email = extractEmail(token);
            Date expDate = extractExpiration(token);
            return email.equals(userDetails.getUsername()) && expDate.after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
