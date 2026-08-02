package com.ivion.main.service;

import com.ivion.main.dto.RegisterRequest;
import com.ivion.main.dto.UserDTO;
import com.ivion.main.dto.UserUpdateRequest;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserDTO> findAll();
    Optional<UserDTO> findById(Integer id);
    Optional<UserDTO> findByEmail(String email);
    UserDTO create(RegisterRequest request);
    UserDTO update(Integer id, UserUpdateRequest request);
    void delete(Integer id, String actingAdminEmail);
}
