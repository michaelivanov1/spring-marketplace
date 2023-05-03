package com.marketapp.marketapp.Controllers;

import java.util.Map;
import java.util.UUID;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
public class RegistrationController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostMapping("/registration")

    public String register(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        String password = payload.get("password");

        //Hash password
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);

        //Generate unique Id
        String uniqueId = UUID.randomUUID().toString();

        Document document = new Document()
                .append("username", username)
                .append("email", email)
                .append("password", encodedPassword)
                .append("account_id", uniqueId);

        mongoTemplate.insert(document, "accounts");

        return "data inserted into db";
    }
}
