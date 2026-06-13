package com.ivion.main.dto;

import com.ivion.main.entity.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductVariantDTO {

    private Integer id;
    private String chip;
    private String screenSize;
    private String storage;
    private String memory;
    private BigDecimal price;

    public static ProductVariantDTO from(ProductVariant v) {
        return new ProductVariantDTO(
                v.getId(),
                v.getChip(),
                v.getScreenSize(),
                v.getStorage(),
                v.getMemory(),
                v.getPrice()
        );
    }
}
