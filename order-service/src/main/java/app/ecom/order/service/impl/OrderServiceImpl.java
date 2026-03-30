package app.ecom.order.service.impl;

import app.ecom.order.dto.OrderRequestDTO;
import app.ecom.order.dto.OrderResponseDTO;
import app.ecom.order.entity.Order;
import app.ecom.order.entity.OrderItem;
import app.ecom.order.exception.OrderNotFoundException;
import app.ecom.order.repository.OrderRepository;
import app.ecom.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public OrderResponseDTO placeOrder(OrderRequestDTO request) {
        Order order = new Order(
                request.getUserId(),
                request.getUsername(),
                request.getTotalAmount(),
                request.getAddressLine(),
                request.getCity(),
                request.getState(),
                request.getPincode()
        );

        if (request.getItems() != null) {
            for (OrderRequestDTO.ItemDTO dto : request.getItems()) {
                order.getItems().add(new OrderItem(
                        dto.getProductId(),
                        dto.getProductName(),
                        dto.getBrand(),
                        dto.getImageUrl(),
                        dto.getPrice(),
                        dto.getQuantity(),
                        order
                ));
            }
        }

        return OrderResponseDTO.from(orderRepository.save(order), "Order placed successfully!");
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(OrderResponseDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found: " + orderId));
        return OrderResponseDTO.from(order);
    }

    @Override
    public OrderResponseDTO cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found: " + orderId));
        if (order.getStatus().equals("DELIVERED"))
            throw new IllegalStateException("Cannot cancel a delivered order");
        order.setStatus("CANCELLED");
        return OrderResponseDTO.from(orderRepository.save(order), "Order cancelled");
    }
}
