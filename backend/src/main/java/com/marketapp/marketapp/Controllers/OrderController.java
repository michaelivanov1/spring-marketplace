package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.OrderService;
import com.marketapp.marketapp.ViewModels.Order;
import com.marketapp.marketapp.ViewModels.OrderRequest;
import com.marketapp.marketapp.ViewModels.UserStand;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/order")
    public ResponseEntity<List<Order>> getAllOrders() {
        return new ResponseEntity<>(orderService.allOrders(), HttpStatus.OK);
    }

    @GetMapping("/order/{email}")
    public ResponseEntity<Optional<List<Order>>> getOrdersByEmail(@PathVariable String email) {
        return new ResponseEntity<>(orderService.allOrdersByEmail(email), HttpStatus.OK);
    }

    @PostMapping("/order")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        return new ResponseEntity<>(orderService.createNewOrder(request.getEmail(),
                request.getGrandTotal(), request.getOrderProduceList()),
                HttpStatus.CREATED);
    }

}
