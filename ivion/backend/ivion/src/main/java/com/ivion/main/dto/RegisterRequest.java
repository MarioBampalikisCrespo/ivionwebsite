package com.ivion.main.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String userSurnames;
    private String email;
    private String password;
}
