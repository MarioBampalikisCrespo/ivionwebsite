package com.ivion.main.dto;

import com.ivion.main.entity.Colour;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ColourDTO {

    private Integer id;
    private String colourName;

    public static ColourDTO from(Colour c) {
        if (c == null) return null;
        return new ColourDTO(c.getId(), c.getColourName());
    }
}
