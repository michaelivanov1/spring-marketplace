package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.OrderService;
import com.marketapp.marketapp.ViewModels.Order;
import com.marketapp.marketapp.ViewModels.OrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:8080", "https://spring-marketplace-client.onrender.com" })
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/order")
    public ResponseEntity<List<Order>> getAllOrders() {
        return new ResponseEntity<>(orderService.allOrders(), HttpStatus.OK);
    }

    @GetMapping("/order/{email}")
    public ResponseEntity<Optional<List<Order>>> getOrdersByBuyerEmail(@PathVariable String email) {
        return new ResponseEntity<>(orderService.allOrdersByBuyerEmail(email), HttpStatus.OK);
    }

    @GetMapping("/order/id/{orderId}")
    public ResponseEntity<Optional<Order>> getSingleOrderById(@PathVariable String orderId) {
        return new ResponseEntity<>(orderService.singleOrderByOrderId(orderId), HttpStatus.OK);
    }

    @PostMapping("/order")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        return new ResponseEntity<>(orderService.createNewOrder(request.getBuyerEmail(), request.getSellerEmail(),
                request.getGrandTotal(), request.getOrderProduceList()),
                HttpStatus.CREATED);
    }

}
