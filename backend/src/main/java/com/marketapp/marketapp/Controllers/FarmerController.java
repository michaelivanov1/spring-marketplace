/*
 * File Name: FarmerController.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-03-31
 */

package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.FarmerService;
import com.marketapp.marketapp.ViewModels.Farmer;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @GetMapping("/farmers")
    public ResponseEntity<List<Farmer>> getAllFarmers() {
        return new ResponseEntity<List<Farmer>>(farmerService.allFarmers(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Farmer>> getSingleFarmerById(@PathVariable ObjectId id) { //converts var passed in to objectId
        return new ResponseEntity<Optional<Farmer>>(farmerService.singleFarmerById(id), HttpStatus.OK);
    }

    @GetMapping("/{accountName}")
    public ResponseEntity<Optional<Farmer>> getSingleFarmerByAccountName(@PathVariable String accountName) {
        return new ResponseEntity<Optional<Farmer>>(farmerService.singleFarmerByName(accountName), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Farmer> createFarmer(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Farmer>(farmerService.createFarmer(payload.get("accountName"),
                payload.get("profileName"), payload.get("email"), payload.get("phoneNumber"),
                payload.get("profileImageURI"), payload.get("bannerImageURI")), HttpStatus.CREATED);
    }

}
