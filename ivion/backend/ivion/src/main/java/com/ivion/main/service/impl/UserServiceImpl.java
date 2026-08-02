package com.ivion.main.service.impl;

import com.ivion.main.dto.RegisterRequest;
import com.ivion.main.dto.UserDTO;
import com.ivion.main.dto.UserUpdateRequest;
import com.ivion.main.entity.Cart;
import com.ivion.main.entity.User;
import com.ivion.main.exception.BadRequestException;
import com.ivion.main.exception.ResourceNotFoundException;
import com.ivion.main.repository.CartProductRepository;
import com.ivion.main.repository.CartRepository;
import com.ivion.main.repository.OrderRepository;
import com.ivion.main.repository.UserRepository;
import com.ivion.main.service.UserService;
import com.ivion.main.util.SanitizationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartProductRepository cartProductRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> findAll() {
        return userRepository.findAll().stream()
                .map(UserDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserDTO> findById(Integer id) {
        return userRepository.findById(id).map(UserDTO::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserDTO> findByEmail(String email) {
        return userRepository.findByEmail(email).map(UserDTO::from);
    }

    @Override
    @Transactional
    public UserDTO create(RegisterRequest request) {
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

        return UserDTO.from(user);
    }

    @Override
    @Transactional
    public UserDTO update(Integer id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));

        String email = request.getEmail().trim().toLowerCase();
        if (!email.equals(user.getEmail())) {
            userRepository.findByEmail(email).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new BadRequestException("El email ya está en uso");
                }
            });
        }

        user.setUsername(SanitizationUtil.sanitize(request.getUsername()));
        user.setUserSurnames(SanitizationUtil.sanitize(request.getUserSurnames()));
        user.setEmail(email);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setUserPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);

        return UserDTO.from(user);
    }

    @Override
    @Transactional
    public void delete(Integer id, String actingAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));

        if (user.getEmail().equalsIgnoreCase(actingAdminEmail)) {
            throw new BadRequestException("No puedes eliminar tu propia cuenta desde aquí");
        }
        if (!orderRepository.findByUserId(id).isEmpty()) {
            throw new BadRequestException("No se puede eliminar un usuario con pedidos registrados");
        }

        cartRepository.findByUserId(id).ifPresent(cart -> {
            cartProductRepository.deleteAll(cartProductRepository.findByCartId(cart.getId()));
            cartRepository.delete(cart);
        });

        userRepository.delete(user);
    }
}
