package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.UserService;
import com.marketapp.marketapp.ViewModels.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:8080", "https://spring-marketplace-client.onrender.com" })
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/user")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.allUsers(), HttpStatus.OK);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<Optional<User>> getSingleUserByEmail(@PathVariable String email) {
        return new ResponseEntity<Optional<User>>(userService.singleUserByEmail(email), HttpStatus.OK);
    }

    @PutMapping("/user/{email}")
    public ResponseEntity<Boolean> updateUser(@PathVariable String email, @RequestBody User updatedUser) {
        User user = userService.updateUser(email, updatedUser);
        return new ResponseEntity<>(Boolean.TRUE, HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/user/{email}")
    public ResponseEntity<User> updateUserFields(@PathVariable String email, @RequestBody Map<String, Object> fields) {
        return new ResponseEntity<>(userService.updateUserByFields(email, fields), HttpStatus.OK);
    }

    @DeleteMapping("/user/{email}")
    public ResponseEntity<Boolean> deleteUserByEmail(@PathVariable String email) {
        boolean deleted = userService.deleteUserByEmail(email);

        if (deleted) {
            return new ResponseEntity<>(Boolean.TRUE, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(Boolean.FALSE, HttpStatus.NOT_FOUND);
        }
    }
}
