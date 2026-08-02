package com.ivion.main.service.impl;

import com.ivion.main.dto.ProductDTO;
import com.ivion.main.dto.ProductRequest;
import com.ivion.main.entity.Category;
import com.ivion.main.entity.Colour;
import com.ivion.main.entity.Product;
import com.ivion.main.exception.ResourceNotFoundException;
import com.ivion.main.repository.CategoryRepository;
import com.ivion.main.repository.ColourRepository;
import com.ivion.main.repository.ProductRepository;
import com.ivion.main.service.ProductService;
import com.ivion.main.util.SanitizationUtil;
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
    private final CategoryRepository categoryRepository;
    private final ColourRepository colourRepository;

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
        return productRepository.findByIdWithVariants(id).map(ProductDTO::from);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> findByCategoryId(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(ProductDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductDTO create(ProductRequest request) {
        Product product = new Product();
        applyRequest(product, request);
        productRepository.save(product);
        return ProductDTO.from(product);
    }

    @Override
    @Transactional
    public ProductDTO update(Integer id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
        applyRequest(product, request);
        productRepository.save(product);
        return ProductDTO.from(product);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado: " + id);
        }
        productRepository.deleteById(id);
    }

    private void applyRequest(Product product, ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada: " + request.getCategoryId()));
        Colour colour = null;
        if (request.getColourId() != null) {
            colour = colourRepository.findById(request.getColourId())
                    .orElseThrow(() -> new ResourceNotFoundException("Color no encontrado: " + request.getColourId()));
        }
        product.setProductName(SanitizationUtil.sanitize(request.getProductName()));
        product.setProductDescription(SanitizationUtil.sanitize(request.getProductDescription()));
        product.setProductMemory(SanitizationUtil.sanitize(request.getProductMemory()));
        product.setProductStorage(SanitizationUtil.sanitize(request.getProductStorage()));
        product.setProductImage(SanitizationUtil.sanitize(request.getProductImage()));
        product.setProductPrice(request.getProductPrice());
        product.setCategory(category);
        product.setColour(colour);
    }
}
