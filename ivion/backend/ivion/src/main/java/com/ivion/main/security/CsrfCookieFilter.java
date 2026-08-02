package com.ivion.main.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * CookieCsrfTokenRepository defers writing the XSRF-TOKEN cookie until something
 * resolves the token, which normally only happens on state-changing requests.
 * For a stateless SPA that means the cookie doesn't exist yet on the first
 * POST/PUT/DELETE of a session, so that request always fails CSRF validation.
 * Resolving the token on every request forces the cookie to be written early
 * (e.g. on the first GET), before the frontend needs to send it back.
 */
public class CsrfCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        if (csrfToken != null) {
            csrfToken.getToken();
        }
        filterChain.doFilter(request, response);
    }
}
