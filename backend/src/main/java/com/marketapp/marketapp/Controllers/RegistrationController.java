package com.marketapp.marketapp.Controllers;

import java.util.Map;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
public class RegistrationController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostMapping("/registration")
    public String test(@RequestBody Map<String, String> payload) {

        String username = payload.get("username");
        String email = payload.get("email");
        String password = payload.get("password");

        Document document = new Document()
                .append("username", username)
                .append("email", email)
                .append("password", password);

        mongoTemplate.insert(document, "accounts");

        return "data inserted into db";
    }
}
