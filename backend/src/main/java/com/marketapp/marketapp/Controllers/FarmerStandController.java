/*
 * File Name: FarmerStandController.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-03-31
 */

package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.FarmerService;
import com.marketapp.marketapp.DAL.FarmerStandService;
import com.marketapp.marketapp.DAL.RegistrationService;
import com.marketapp.marketapp.ViewModels.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
public class FarmerStandController {

    @Autowired
    private FarmerStandService farmerStandService;

    @Autowired
    private FarmerService farmerService;

    @GetMapping("/farmer_stand")
    public ResponseEntity<List<FarmerStand>> getAllFarmerStands() {
        return new ResponseEntity<List<FarmerStand>>(farmerStandService.allFarmerStands(), HttpStatus.OK);
    }

    @GetMapping("/farmer_stand/{accountName}")
    public ResponseEntity<Optional<FarmerStand>> getSingleFarmerStandByAccountName(@PathVariable String accountName) {
        return new ResponseEntity<Optional<FarmerStand>>(farmerStandService.singleFarmerStandByAccountName(accountName), HttpStatus.OK);
    }

    @PostMapping("/farmer_stand")
    public ResponseEntity<FarmerStand> createFarmerStand(@RequestBody FarmerStandRequest request) {

        Optional<Farmer> farmerOp = farmerService.singleFarmerByName(request.getAccountName());
        Farmer farmer = null;
        if (farmerOp.isPresent()) {
            farmer = farmerOp.get();
        }

        return new ResponseEntity<>(farmerStandService.createFarmerStand(farmer, request.getProduceList()),
                HttpStatus.CREATED);

    }

}
