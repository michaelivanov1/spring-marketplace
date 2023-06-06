/*
 * File Name: FarmerStand.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-05-24
 */

package com.marketapp.marketapp.ViewModels;

import com.marketapp.marketapp.DAL.FarmerService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Document(collection = "farmer_stands")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class FarmerStand { // we don't need a stand name / farm name because it will be linked accordingly

    /*@Autowired
    private FarmerService farmerService;
    */

    @Id
    private ObjectId id;

    private String accountName;
    private String profileName;
    private ArrayList<Produce> produceList;

    public FarmerStand(Farmer farmer, ArrayList<Produce> produceList) {

        //search for farmer through given accountName
        /*Optional<Farmer> farmer = farmerService.singleFarmerByName(account.getUsername());

        String profileName = "";
        if (farmer.isPresent()) {
            profileName = farmer.get().getProfileName();
        }*/

        this.accountName = farmer.getAccountName();
        this.profileName = farmer.getProfileName(); //if a non-existent accountName is given, profile name will be null
        this.produceList = produceList;
    }
}
