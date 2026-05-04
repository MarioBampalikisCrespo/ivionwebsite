package com.ivion.main.dto;

import com.ivion.main.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryDTO {

    private Integer id;
    private String categoryName;
    private String categoryDescription;

    public static CategoryDTO from(Category c) {
        return new CategoryDTO(c.getId(), c.getCategoryName(), c.getCategoryDescription());
    }
}
