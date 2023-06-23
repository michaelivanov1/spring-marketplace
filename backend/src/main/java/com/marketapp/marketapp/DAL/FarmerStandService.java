/*
 * File Name: FarmerStandService.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-05-24
 */

package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.*;
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

    public FarmerStand createFarmerStand(User user, ArrayList<Produce> produceList) {
        return farmerStandRepository.insert(new FarmerStand(user, produceList));
    }

    public Optional<FarmerStand> singleFarmerStandById(ObjectId id) {
        return farmerStandRepository.findById(id);
    }

    public Optional<FarmerStand> singleFarmerStandByEmail(String email) {
        return farmerStandRepository.findFarmerStandByEmail(email);
    }
}
