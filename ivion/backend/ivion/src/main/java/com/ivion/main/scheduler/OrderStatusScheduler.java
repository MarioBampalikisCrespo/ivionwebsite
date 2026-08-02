package com.ivion.main.scheduler;

import com.ivion.main.entity.Order;
import com.ivion.main.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Demo order tracking: the target state is derived from elapsed time since
 * order creation rather than stepped incrementally, so a missed run (e.g. the
 * free-tier host asleep for a while) self-corrects to the right state on the
 * next tick instead of drifting behind.
 */
@Component
@RequiredArgsConstructor
public class OrderStatusScheduler {

    private static final List<String> TERMINAL_STATES = List.of("DELIVERED", "CANCELLED");

    private static final Duration TO_SHIPPED    = Duration.ofSeconds(30);
    private static final Duration TO_IN_TRANSIT = Duration.ofSeconds(60);
    private static final Duration TO_DELIVERED  = Duration.ofSeconds(90);

    private final OrderRepository orderRepository;

    @Scheduled(fixedRate = 10_000)
    @Transactional
    public void advanceOrderStates() {
        List<Order> active = orderRepository.findByOrderStateNotIn(TERMINAL_STATES);
        for (Order order : active) {
            String target = targetState(order.getOrderDate());
            if (!target.equals(order.getOrderState())) {
                order.setOrderState(target);
                orderRepository.save(order);
            }
        }
    }

    private String targetState(LocalDateTime orderDate) {
        Duration elapsed = Duration.between(orderDate, LocalDateTime.now());
        if (elapsed.compareTo(TO_DELIVERED) >= 0)  return "DELIVERED";
        if (elapsed.compareTo(TO_IN_TRANSIT) >= 0) return "IN_TRANSIT";
        if (elapsed.compareTo(TO_SHIPPED) >= 0)    return "SHIPPED";
        return "PENDING";
    }
}
