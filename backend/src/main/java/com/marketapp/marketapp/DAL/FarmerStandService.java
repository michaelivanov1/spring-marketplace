/*
 * File Name: FarmerStandService.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-05-24
 */

package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Account;
import com.marketapp.marketapp.ViewModels.Farmer;
import com.marketapp.marketapp.ViewModels.FarmerStand;
import com.marketapp.marketapp.ViewModels.Produce;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FarmerStandService {

    @Autowired
    private FarmerStandRepository farmerStandRepository;

    public List<FarmerStand> allFarmerStands() {
        return farmerStandRepository.findAll();
    }

    public FarmerStand createFarmerStand(Farmer farmer, ArrayList<Produce> produceList) {
        FarmerStand farmerStand = farmerStandRepository.insert(new FarmerStand(farmer, produceList));
        return farmerStand;
    }

    public Optional<FarmerStand> singleFarmerStandById(ObjectId id) {
        return farmerStandRepository.findById(id);
    }

    public Optional<FarmerStand> singleFarmerStandByAccountName(String accountName) {
        return farmerStandRepository.findFarmerStandByAccountName(accountName);
    }
}
