package com.ivion.main.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class ProductRequest {

    @NotBlank
    @Size(max = 150)
    @Pattern(regexp = "^[^<>\"';&|]*$", message = "Field contains invalid characters")
    private String productName;

    @NotBlank
    @Size(max = 2000)
    private String productDescription;

    @NotBlank
    @Size(max = 50)
    @Pattern(regexp = "^[^<>\"';&|]*$", message = "Field contains invalid characters")
    private String productMemory;

    @NotBlank
    @Size(max = 50)
    @Pattern(regexp = "^[^<>\"';&|]*$", message = "Field contains invalid characters")
    private String productStorage;

    @NotBlank
    @Size(max = 500)
    @Pattern(regexp = "^[^<>\"';&|]*$", message = "Field contains invalid characters")
    private String productImage;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @Digits(integer = 8, fraction = 2)
    private BigDecimal productPrice;

    @NotNull
    private Integer categoryId;

    private Integer colourId;
}
