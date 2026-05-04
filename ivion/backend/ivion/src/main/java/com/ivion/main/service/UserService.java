package com.ivion.main.service;

import com.ivion.main.dto.UserDTO;
import java.util.Optional;

public interface UserService {
    Optional<UserDTO> findById(Integer id);
    Optional<UserDTO> findByEmail(String email);
}
