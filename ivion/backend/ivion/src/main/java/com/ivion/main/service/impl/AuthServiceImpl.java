package com.ivion.main.service.impl;

import com.ivion.main.dto.AuthResponse;
import com.ivion.main.dto.LoginRequest;
import com.ivion.main.dto.RegisterRequest;
import com.ivion.main.dto.UserDTO;
import com.ivion.main.entity.Cart;
import com.ivion.main.entity.User;
import com.ivion.main.exception.BadRequestException;
import com.ivion.main.exception.ResourceNotFoundException;
import com.ivion.main.repository.CartRepository;
import com.ivion.main.repository.UserRepository;
import com.ivion.main.security.JwtUtil;
import com.ivion.main.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("El email ya está en uso");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setUserSurnames(request.getUserSurnames());
        user.setEmail(request.getEmail());
        user.setUserPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setTotal(BigDecimal.ZERO);
        cartRepository.save(cart);

        return new AuthResponse(jwtUtil.generateToken(user.getEmail()), UserDTO.from(user));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return new AuthResponse(jwtUtil.generateToken(user.getEmail()), UserDTO.from(user));
    }
}
