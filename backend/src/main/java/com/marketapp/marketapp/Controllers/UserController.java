package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.UserService;
import com.marketapp.marketapp.ViewModels.User;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/user")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.allUsers(), HttpStatus.OK);
    }

    // @GetMapping("/user/{id}")
    // public ResponseEntity<Optional<User>> getSingleUserById(@PathVariable String
    // id) {
    // return new ResponseEntity<Optional<User>>(userService.singleUserById(new
    // ObjectId(id)), HttpStatus.OK);
    // }

    @GetMapping("/user/{email}")
    public ResponseEntity<Optional<User>> getSingleUserByEmail(@PathVariable String email) {
        return new ResponseEntity<Optional<User>>(userService.singleUserByEmail(email), HttpStatus.OK);
    }

    @PutMapping("/user/{email}")
    public ResponseEntity<Boolean> updateUser(@PathVariable ObjectId id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        return new ResponseEntity<Boolean>(Boolean.TRUE, HttpStatus.NO_CONTENT);
    }
}
