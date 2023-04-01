/*
 * File Name: FarmerService.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-03-31
 */

package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Farmer;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FarmerService {
    @Autowired
    private FarmerRepository farmerRepository;

    public List<Farmer> allFarmers() {
        return farmerRepository.findAll();
    }

    public Optional<Farmer> singleFarmerById(ObjectId id) { //optional because might rtn null
        return farmerRepository.findById(id);
    }

    public Optional<Farmer> singleFarmerByName(String accountName) {
        return farmerRepository.findFarmerByAccountName(accountName);
    }

    public Farmer createFarmer(String profileName, String accountName, String email, String phoneNumber,
                               String profileImageURI, String bannerImageURI) {

        Farmer farmer = farmerRepository.insert(new Farmer(profileName, accountName, email, phoneNumber, profileImageURI, bannerImageURI));
        return farmer;
    }
}
