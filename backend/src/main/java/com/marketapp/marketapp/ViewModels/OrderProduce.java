package com.marketapp.marketapp.ViewModels;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderProduce {

    private String produceImage;
    private String foodName;
    private int qty;
    private String harvestDate;
    private double total;
}
