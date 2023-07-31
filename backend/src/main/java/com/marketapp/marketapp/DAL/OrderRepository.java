package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Order;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, ObjectId> {

    Optional<List<Order>> findOrdersByEmail(String email);
    Optional<Order> findOrderByOrderId(String orderId);
    boolean existsByEmail(String email);
}
