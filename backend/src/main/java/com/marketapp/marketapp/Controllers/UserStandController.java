/*
 * File Name: UserStandController.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-03-31
 */

package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.UserStandService;
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
@CrossOrigin(origins = { "http://localhost:8080", "https://spring-marketplace-client.onrender.com" })
@RequiredArgsConstructor
public class UserStandController {

    private final UserStandService userStandService;

    private final UserService userService;

    @GetMapping("/user_stand")
    public ResponseEntity<List<UserStand>> getAllUserStands() {
        return new ResponseEntity<List<UserStand>>(userStandService.allUserStands(), HttpStatus.OK);
    }

    @GetMapping("/user_stand/{email}")
    public ResponseEntity<Optional<UserStand>> getSingleUserStandByEmail(@PathVariable String email) {
        return new ResponseEntity<Optional<UserStand>>(userStandService.singleUserStandByEmail(email), HttpStatus.OK);
    }

    @PostMapping("/user_stand")
    public ResponseEntity<UserStand> createUserStand(@RequestBody UserStandRequest request) {

        Optional<User> userOp = userService.singleUserByEmail(request.getEmail());
        User user = null;
        if (userOp.isPresent()) {
            user = userOp.get();
        }

        return new ResponseEntity<>(userStandService.createUserStand(user, request.getProduceList()),
                HttpStatus.CREATED);

    }

    @PutMapping("/user_stand")
    public ResponseEntity<UserStand> addToUserStand(@RequestBody ProduceRequest request) {
        return new ResponseEntity<>(userStandService.addToUserStand(request.getEmail(), request.getProduce()),
                HttpStatus.CREATED);
    }

    @PutMapping("/user_stand/edit")
    public ResponseEntity<UserStand> updateUserStand(@RequestBody UserStandRequest request) {
        return new ResponseEntity<>(userStandService.updateProduceList(request.getDisplayName(), request.getEmail(),
                request.getProduceList()), HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/user_stand/{email}")
    public ResponseEntity<Boolean> deleteUserStand(@PathVariable String email) {
        boolean deleted = userStandService.deleteUserStandByEmail(email);
        if (deleted) {
            return new ResponseEntity<>(Boolean.TRUE, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(Boolean.FALSE, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/user_stand/{email}/produce/{foodName}")
    public ResponseEntity<Boolean> deleteProduceItem(@PathVariable String email, @PathVariable String foodName) {
        boolean deleted = userStandService.deleteProduceItemByEmailAndFoodName(email, foodName);
        if (deleted) {
            return new ResponseEntity<>(Boolean.TRUE, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(Boolean.FALSE, HttpStatus.NOT_FOUND);
        }
    }

}
