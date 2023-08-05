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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Data
@NoArgsConstructor
public class Produce {

    private String foodName;
    //private int qty;
    private int qoh;
    private int qoo;
    //private String qrcode;
    //private String qrcodetxt;
    private String harvestDate;
    private double price;

    public Produce(String foodName, int qoh, String harvestDate, double price) {
        this.foodName = foodName;
        //this.qty = qty;
        this.qoh = qoh;
        this.qoo = 0;
        //this.qrcode = "";
        //this.qrcodetxt = "";
        this.harvestDate = harvestDate; //TODO: convert incoming string to proper date
        //this.harvestDate = convertStrToDate(harvestDate);
        this.price = price;
    }
    public Produce(String foodName, int qoh, String harvestDate, double price, int qoo) {
        this.foodName = foodName;
        //this.qty = qty;
        this.qoh = qoh;
        this.qoo = qoo;
        //this.qrcode = "";
        //this.qrcodetxt = "";
        this.harvestDate = harvestDate; //TODO: convert incoming string to proper date
        //this.harvestDate = convertStrToDate(harvestDate);
        this.price = price;
    }

    private Date convertStrToDate(String date) {
        try {
            return new SimpleDateFormat("dd/MM/yyyy").parse(date);
        }
        catch (ParseException ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
