package com.ivion.main.service;

import com.ivion.main.dto.ProductDTO;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<ProductDTO> findAll();
    Optional<ProductDTO> findById(Integer id);
    List<ProductDTO> findByCategoryId(Integer categoryId);
}
