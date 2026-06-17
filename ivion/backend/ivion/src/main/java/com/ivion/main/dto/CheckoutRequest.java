package com.ivion.main.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CheckoutRequest {

    @NotBlank
    @Size(max = 300)
    @Pattern(regexp = "^[^<>\"';&|]*$", message = "Field contains invalid characters")
    private String shipmentAddress;
}
