package com.ivion.main.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank
    @Size(max = 80)
    @Pattern(regexp = "^[^<>\"';&|]*$", message = "Field contains invalid characters")
    private String username;

    @NotBlank
    @Size(max = 120)
    @Pattern(regexp = "^[^<>\"';&|]*$", message = "Field contains invalid characters")
    private String userSurnames;

    @NotBlank
    @Email
    @Size(max = 254)
    private String email;

    @NotBlank
    @Size(min = 6, max = 128)
    private String password;
}
