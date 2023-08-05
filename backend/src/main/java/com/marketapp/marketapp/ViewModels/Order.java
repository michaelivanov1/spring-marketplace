package com.marketapp.marketapp.ViewModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

@Document(collection = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class Order {

    @Id
    private ObjectId id;

    private String buyerEmail;
    private String sellerEmail;
    private double grandTotal;
    private String invoiceDate;
    private String orderId;
    private ArrayList<OrderProduce> orderProduceList;
    private String qrcode;
    private String qrcodetxt;

    public void createNewOrder(String buyerEmail, String sellerEmail, double grandTotal, ArrayList<OrderProduce> orderProduceList) {
        this.buyerEmail = buyerEmail;
        this.sellerEmail = sellerEmail;
        this.grandTotal = grandTotal;

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();
        this.invoiceDate = dtf.format(now);

        this.orderProduceList = orderProduceList;
        this.orderId = UUID.randomUUID().toString();

        //TODO: make a qr code for the order
        this.qrcode = "test_qr_str";
        this.qrcodetxt = "test_qr_text_str";
    }

}
