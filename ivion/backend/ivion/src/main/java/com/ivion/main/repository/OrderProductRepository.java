package com.ivion.main.repository;

import com.ivion.main.entity.OrderProduct;
import com.ivion.main.entity.OrderProductId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderProductRepository extends JpaRepository<OrderProduct, OrderProductId> {
    List<OrderProduct> findByOrderId(Integer orderId);
}