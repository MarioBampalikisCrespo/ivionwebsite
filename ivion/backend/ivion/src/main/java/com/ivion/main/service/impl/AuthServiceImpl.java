package com.ivion.main.service.impl;

import com.ivion.main.dto.AuthResponse;
import com.ivion.main.dto.LoginRequest;
import com.ivion.main.dto.RegisterRequest;
import com.ivion.main.dto.UserDTO;
import com.ivion.main.entity.Cart;
import com.ivion.main.entity.User;
import com.ivion.main.exception.BadRequestException;
import com.ivion.main.repository.CartRepository;
import com.ivion.main.repository.UserRepository;
import com.ivion.main.security.JwtUtil;
import com.ivion.main.service.AuthService;
import com.ivion.main.util.SanitizationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final int MAX_FAILED_ATTEMPTS    = 5;
    private static final int LOCK_DURATION_MINUTES  = 15;

    private final UserRepository       userRepository;
    private final CartRepository       cartRepository;
    private final PasswordEncoder      passwordEncoder;
    private final JwtUtil              jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BadRequestException("El email ya está en uso");
        }

        User user = new User();
        user.setUsername(SanitizationUtil.sanitize(request.getUsername()));
        user.setUserSurnames(SanitizationUtil.sanitize(request.getUserSurnames()));
        user.setEmail(email);
        user.setUserPassword(passwordEncoder.encode(request.getPassword()));
        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setTotal(BigDecimal.ZERO);
        cartRepository.save(cart);

        return new AuthResponse(jwtUtil.generateToken(email), UserDTO.from(user));
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        // Find user — same generic error if not found (prevents account enumeration)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        // Check account lock
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            long minutes = ChronoUnit.MINUTES.between(LocalDateTime.now(), user.getLockedUntil()) + 1;
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Cuenta bloqueada temporalmente. Inténtalo de nuevo en " + minutes + " minuto(s).");
        }

        // Attempt authentication
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        } catch (BadCredentialsException e) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
            }
            userRepository.save(user);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }

        // Success — reset counter
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        return new AuthResponse(jwtUtil.generateToken(email), UserDTO.from(user));
    }
}
