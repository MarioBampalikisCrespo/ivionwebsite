package com.ivion.main.dto;

import com.ivion.main.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductDTO {

    private Integer id;
    private String productName;
    private String productDescription;
    private String productMemory;
    private String productStorage;
    private String productImage;
    private BigDecimal productPrice;
    private CategoryDTO category;
    private ColourDTO colour;

    public static ProductDTO from(Product p) {
        return new ProductDTO(
                p.getId(),
                p.getProductName(),
                p.getProductDescription(),
                p.getProductMemory(),
                p.getProductStorage(),
                p.getProductImage(),
                p.getProductPrice(),
                p.getCategory() != null ? CategoryDTO.from(p.getCategory()) : null,
                p.getColour() != null ? ColourDTO.from(p.getColour()) : null
        );
    }
}
