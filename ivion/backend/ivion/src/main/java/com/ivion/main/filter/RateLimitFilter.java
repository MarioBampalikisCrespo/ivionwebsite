package com.ivion.main.filter;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {

    private static final long WINDOW_MS      = 60_000L;
    private static final int  LIMIT_AUTH     = 10;
    private static final int  LIMIT_GENERAL  = 60;

    private final ConcurrentHashMap<String, Deque<Long>> log = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  request  = (HttpServletRequest)  req;
        HttpServletResponse response = (HttpServletResponse) res;

        String  ip       = resolveClientIp(request);
        boolean authPath = request.getRequestURI().startsWith("/api/auth/");
        int     limit    = authPath ? LIMIT_AUTH : LIMIT_GENERAL;
        String  key      = ip + ":" + (authPath ? "auth" : "api");

        if (!isAllowed(key, limit)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                "{\"status\":429,\"message\":\"Too many requests. Please try again later.\"}"
            );
            return;
        }

        chain.doFilter(req, res);
    }

    private boolean isAllowed(String key, int maxRequests) {
        long now = System.currentTimeMillis();
        Deque<Long> deque = log.compute(key, (k, d) -> {
            if (d == null) d = new ArrayDeque<>();
            while (!d.isEmpty() && d.peekFirst() < now - WINDOW_MS) d.pollFirst();
            d.addLast(now);
            return d;
        });
        return deque.size() <= maxRequests;
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
