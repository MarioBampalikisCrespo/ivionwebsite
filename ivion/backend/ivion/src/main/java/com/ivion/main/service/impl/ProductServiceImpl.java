package com.ivion.main.service.impl;

import com.ivion.main.dto.ProductDTO;
import com.ivion.main.repository.ProductRepository;
import com.ivion.main.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream()
                .map(ProductDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductDTO> findById(Integer id) {
        return productRepository.findById(id).map(ProductDTO::from);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> findByCategoryId(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(ProductDTO::from)
                .collect(Collectors.toList());
    }
}
