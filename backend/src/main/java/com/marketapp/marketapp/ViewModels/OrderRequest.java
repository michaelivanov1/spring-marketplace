package com.marketapp.marketapp.ViewModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

    private String email;
    private double grandTotal;
    private ArrayList<OrderProduce> orderProduceList;
}
