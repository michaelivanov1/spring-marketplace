/*
 * File Name: FarmerStandService.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-05-24
 */

package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Account;
import com.marketapp.marketapp.ViewModels.FarmerStand;
import com.marketapp.marketapp.ViewModels.Produce;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FarmerStandService {

    @Autowired
    private FarmerStandRepository farmerStandRepository;

    public List<FarmerStand> allFarmerStands() {
        return farmerStandRepository.findAll();
    }

    public FarmerStand createFarmerStand(Account account, ArrayList<Produce> produceList) {
        FarmerStand farmerStand = farmerStandRepository.insert(new FarmerStand(account, produceList));
        return farmerStand;
    }
}
