/*
 * File Name: Produce.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-05-24
 */

package com.marketapp.marketapp.ViewModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
public class Produce {

    private String foodName;
    private int qty;
    private String harvestDate; //TODO: Will change to be a proper date object so its uniform
    private double price;

    public Produce(String foodName, int qty, String harvestDate, double price) {
        this.foodName = foodName;
        this.qty = qty;
        this.harvestDate = harvestDate;
        this.price = price;
    }

}
