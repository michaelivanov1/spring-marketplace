package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Order;
import com.marketapp.marketapp.ViewModels.OrderProduce;
import com.marketapp.marketapp.ViewModels.Produce;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public List<Order> allOrders() {
        return orderRepository.findAll();
    }

    public Optional<List<Order>> allOrdersByEmail(String email) {
        return orderRepository.findOrdersByEmail(email);
    }

    public Optional<Order> singleOrderByOrderId(String orderId) {
        return orderRepository.findOrderByOrderId(orderId);
    }

    public Order createNewOrder(String email, double grandTotal, ArrayList<
            OrderProduce> orderProduceList) {
        Order newOrder = new Order();
        newOrder.createNewOrder(email, grandTotal, orderProduceList);

        orderRepository.save(newOrder);
        return newOrder;
    }

}
