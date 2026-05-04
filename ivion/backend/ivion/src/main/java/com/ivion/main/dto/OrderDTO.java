package com.ivion.main.dto;

import com.ivion.main.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class OrderDTO {

    private Integer id;
    private String orderState;
    private LocalDateTime orderDate;
    private String shipmentAddress;
    private List<OrderItemDTO> items;

    public static OrderDTO from(Order o, List<OrderItemDTO> items) {
        return new OrderDTO(o.getId(), o.getOrderState(), o.getOrderDate(), o.getShipmentAddress(), items);
    }
}
