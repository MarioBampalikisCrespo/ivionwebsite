package com.ivion.main.dto;

import com.ivion.main.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
    private List<ProductVariantDTO> variants;

    public static ProductDTO from(Product p) {
        List<ProductVariantDTO> variants = (p.getVariants() != null)
                ? p.getVariants().stream().map(ProductVariantDTO::from).collect(Collectors.toList())
                : Collections.emptyList();
        return new ProductDTO(
                p.getId(),
                p.getProductName(),
                p.getProductDescription(),
                p.getProductMemory(),
                p.getProductStorage(),
                p.getProductImage(),
                p.getProductPrice(),
                p.getCategory() != null ? CategoryDTO.from(p.getCategory()) : null,
                p.getColour() != null ? ColourDTO.from(p.getColour()) : null,
                variants
        );
    }
}
