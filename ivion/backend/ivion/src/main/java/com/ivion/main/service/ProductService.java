package com.ivion.main.service;

import com.ivion.main.dto.ProductDTO;
import com.ivion.main.dto.ProductRequest;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<ProductDTO> findAll();
    Optional<ProductDTO> findById(Integer id);
    List<ProductDTO> findByCategoryId(Integer categoryId);
    ProductDTO create(ProductRequest request);
    ProductDTO update(Integer id, ProductRequest request);
    void delete(Integer id);
}
