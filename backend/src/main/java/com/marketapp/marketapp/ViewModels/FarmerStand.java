/*
 * File Name: FarmerStand.java
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

import java.util.ArrayList;
import java.util.List;

@Document(collection = "farmer_stands")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FarmerStand { //we don't need a stand name / farm name because it will be linked accordingly

    @Id
    private ObjectId id;

    private Account account;
    private ArrayList<Produce> produceList;

    public FarmerStand(Account account, ArrayList<Produce> produceList) {
        this.account = account;
        this.produceList = produceList;
    }
}
