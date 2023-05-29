/*
 * File Name: FarmerStandController.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-03-31
 */

package com.marketapp.marketapp.Controllers;

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
    private RegistrationService registrationService;

    @GetMapping("/farmer_stand")
    public ResponseEntity<List<FarmerStand>> getAllFarmerStands() {
        return new ResponseEntity<List<FarmerStand>>(farmerStandService.allFarmerStands(), HttpStatus.OK);
    }

    @PostMapping("/farmer_stand")
    public ResponseEntity<FarmerStand> createFarmerStand(@RequestBody FarmerStandRequest request) {

        //find an account by id
        Optional<Account> accountOp = registrationService.singleAccountById(new ObjectId(request.getId()));

        return accountOp.map(account -> new ResponseEntity<>(farmerStandService.createFarmerStand(
                account, request.getProduceList()), HttpStatus.CREATED)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));

    }

}
