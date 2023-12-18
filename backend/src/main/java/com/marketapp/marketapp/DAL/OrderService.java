package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Order;
import com.marketapp.marketapp.ViewModels.OrderProduce;
import com.marketapp.marketapp.ViewModels.Produce;
import com.marketapp.marketapp.ViewModels.UserStand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserStandRepository userStandRepository;

    public List<Order> allOrders() {
        return orderRepository.findAll();
    }

    public Optional<List<Order>> allOrdersByBuyerEmail(String email) {
        return orderRepository.findOrdersByBuyerEmail(email);
    }

    public Optional<Order> singleOrderByOrderId(String orderId) {
        return orderRepository.findOrderByOrderId(orderId);
    }

    public Order createNewOrder(String buyerEmail, String sellerEmail, double grandTotal, ArrayList<
            OrderProduce> orderProduceList) {

        //update all qoh and qoo for what is in the order list
        int count = 0 ;
        UserStand standProduceComesFrom = userStandRepository.findByEmail(sellerEmail).get();
        ArrayList<Produce> updatedProduceList = standProduceComesFrom.getProduceList();

        for (OrderProduce op : orderProduceList) {
            int qtyOrdered = op.getQty();
            int originalQoh = standProduceComesFrom.getProduceList().get(count).getQoh();
            int originalQoo = standProduceComesFrom.getProduceList().get(count).getQoo();
            int newQoh = originalQoh - qtyOrdered;
            int newQoo = originalQoo + qtyOrdered;

            updatedProduceList.set(count, new Produce(standProduceComesFrom.getProduceList().get(count).getFoodName(),
                    newQoh, standProduceComesFrom.getProduceList().get(count).getHarvestDate(),
                    standProduceComesFrom.getProduceList().get(count).getPrice(),
                    newQoo, standProduceComesFrom.getProduceList().get(count).getProduceImage()));

            count++;
        }
        standProduceComesFrom.updateProduceList(updatedProduceList);
        userStandRepository.save(standProduceComesFrom);

        Order newOrder = new Order();
        newOrder.createNewOrder(buyerEmail, sellerEmail, grandTotal, orderProduceList);

        orderRepository.save(newOrder);
        return newOrder;
    }

}
