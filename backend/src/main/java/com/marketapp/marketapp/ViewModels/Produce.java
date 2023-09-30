/*
 * File Name: Produce.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-05-24
 */

package com.marketapp.marketapp.ViewModels;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Produce {

    private String foodName;
    private int qoh;
    private int qoo;
    private String harvestDate;
    private double price;
    private String produceImage;

    public Produce(String foodName, int qoh, String harvestDate, double price) {
        this.foodName = foodName;
        this.qoh = qoh;
        this.qoo = 0;
        this.harvestDate = harvestDate; 
        this.price = price;
        this.produceImage = "";
    }

    public Produce(String foodName, int qoh, String harvestDate, double price, int qoo, String produceImage) {
        this.foodName = foodName;
        this.qoh = qoh;
        this.qoo = qoo;
        this.harvestDate = harvestDate; 
        this.price = price;
        this.produceImage = produceImage;
    }
}
