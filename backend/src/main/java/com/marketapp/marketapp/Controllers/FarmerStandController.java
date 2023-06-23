/*
 * File Name: FarmerStandController.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-03-31
 */

package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.FarmerStandService;
import com.marketapp.marketapp.DAL.UserService;
import com.marketapp.marketapp.ViewModels.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
@RequiredArgsConstructor
public class FarmerStandController {

    private final FarmerStandService farmerStandService;

    private final UserService userService;

    @GetMapping("/farmer_stand")
    public ResponseEntity<List<FarmerStand>> getAllFarmerStands() {
        return new ResponseEntity<List<FarmerStand>>(farmerStandService.allFarmerStands(), HttpStatus.OK);
    }

    @GetMapping("/farmer_stand/{email}")
    public ResponseEntity<Optional<FarmerStand>> getSingleFarmerStandByEmail(@PathVariable String email) {
        return new ResponseEntity<Optional<FarmerStand>>(farmerStandService.singleFarmerStandByEmail(email), HttpStatus.OK);
    }

    @PostMapping("/farmer_stand")
    public ResponseEntity<FarmerStand> createFarmerStand(@RequestBody FarmerStandRequest request) {

        Optional<User> userOp = userService.singleUserByEmail(request.getEmail());
        User user = null;
        if (userOp.isPresent()) {
            user = userOp.get();
        }

        return new ResponseEntity<>(farmerStandService.createFarmerStand(user, request.getProduceList()),
                HttpStatus.CREATED);

    }

}
