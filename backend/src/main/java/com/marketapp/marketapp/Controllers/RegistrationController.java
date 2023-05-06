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

    /*@Autowired
    private MongoTemplate mongoTemplate;

     */

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/registration")
    public ResponseEntity<Account> register(@RequestBody Map<String, String> payload) {

        //Hash password
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(payload.get("password"));

        return new ResponseEntity<Account>(registrationService.createAccount(payload.get("username"),
                payload.get("email"), encodedPassword), HttpStatus.CREATED);


        /*String username = payload.get("username");
        String email = payload.get("email");
        String password = payload.get("password");

        //Hash password
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);


        Document document = new Document()
                .append("username", username)
                .append("email", email)
                .append("password", encodedPassword);

        mongoTemplate.insert(document, "accounts");

        return "data inserted into db";

         */
    }

    /*
    public ResponseEntity<Farmer> createFarmer(@RequestBody Map<String, String> payload) {
        return new ResponseEntity<Farmer>(farmerService.createFarmer(payload.get("accountName"),
                payload.get("profileName"), payload.get("email"), payload.get("phoneNumber"),
                payload.get("profileImageURI"), payload.get("bannerImageURI")), HttpStatus.CREATED);
    }
     */
}
