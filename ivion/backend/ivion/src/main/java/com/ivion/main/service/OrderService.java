package com.ivion.main.service;

import com.ivion.main.dto.OrderDTO;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<OrderDTO> findByUserId(Integer userId);
    Optional<OrderDTO> findById(Integer id);
    Optional<OrderDTO> findByIdAndUserId(Integer id, Integer userId);
    OrderDTO createFromCart(Integer userId, String shipmentAddress);
}
