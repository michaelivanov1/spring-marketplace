package com.marketapp.marketapp.Controllers;

import java.util.Map;
import java.util.UUID;

import com.marketapp.marketapp.DAL.RegistrationService;
import com.marketapp.marketapp.ViewModels.Account;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/registration")
    public ResponseEntity<Account> register(@RequestBody Map<String, String> payload) {

        //Hash password
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(payload.get("password"));

        return new ResponseEntity<Account>(registrationService.createAccount(payload.get("username"),
                payload.get("email"), encodedPassword), HttpStatus.CREATED);

    }

   
}
