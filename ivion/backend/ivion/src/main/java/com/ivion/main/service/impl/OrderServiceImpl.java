package com.ivion.main.service.impl;

import com.ivion.main.dto.OrderDTO;
import com.ivion.main.dto.OrderItemDTO;
import com.ivion.main.entity.*;
import com.ivion.main.exception.BadRequestException;
import com.ivion.main.exception.ResourceNotFoundException;
import com.ivion.main.repository.*;
import com.ivion.main.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderProductRepository orderProductRepository;
    private final CartRepository cartRepository;
    private final CartProductRepository cartProductRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> findByUserId(Integer userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(order -> {
                    List<OrderItemDTO> items = orderProductRepository.findByOrderId(order.getId())
                            .stream().map(OrderItemDTO::from).collect(Collectors.toList());
                    return OrderDTO.from(order, items);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrderDTO> findById(Integer id) {
        return orderRepository.findById(id).map(order -> {
            List<OrderItemDTO> items = orderProductRepository.findByOrderId(order.getId())
                    .stream().map(OrderItemDTO::from).collect(Collectors.toList());
            return OrderDTO.from(order, items);
        });
    }

    @Override
    @Transactional
    public OrderDTO createFromCart(Integer userId, String shipmentAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + userId));
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado para el usuario " + userId));
        List<CartProduct> cartItems = cartProductRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) throw new BadRequestException("El carrito está vacío");

        Order order = new Order();
        order.setUser(user);
        order.setOrderState("PENDING");
        order.setOrderDate(LocalDateTime.now());
        order.setShipmentAddress(shipmentAddress);
        orderRepository.save(order);

        for (CartProduct cp : cartItems) {
            OrderProductId opId = new OrderProductId(order.getId(), cp.getProduct().getId());
            OrderProduct op = new OrderProduct(opId, order, cp.getProduct(),
                    cp.getQuantity(), cp.getProduct().getProductPrice());
            orderProductRepository.save(op);
        }

        cartProductRepository.deleteAll(cartItems);
        cart.setTotal(BigDecimal.ZERO);
        cartRepository.save(cart);

        List<OrderItemDTO> items = orderProductRepository.findByOrderId(order.getId())
                .stream().map(OrderItemDTO::from).collect(Collectors.toList());
        return OrderDTO.from(order, items);
    }
}
