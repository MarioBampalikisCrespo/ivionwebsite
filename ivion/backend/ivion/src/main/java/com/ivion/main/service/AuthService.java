package com.ivion.main.service;

import com.ivion.main.dto.AuthResponse;
import com.ivion.main.dto.LoginRequest;
import com.ivion.main.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
