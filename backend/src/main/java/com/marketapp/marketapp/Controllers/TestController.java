/*
 * File Name: TestController.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-03-01
 */

package com.marketapp.marketapp.Controllers;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import java.util.Map;

import org.apache.catalina.authenticator.Constants;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
public class TestController {

    @Autowired
    private MongoTemplate mongoTemplate;

    // @RequestMapping("/test")
    @PostMapping("/test")
    public String test(@RequestBody Map<String, String> payload) {

        String text = payload.get("text");

        Document document = new Document("name", text);
        mongoTemplate.insert(document, "testCollection");

        return "data inserted into db: " + text;

        // MongoClient client = MongoClients.create(
        //         "mongodb+srv://admin:KqZVIcWcbn5jHe4Q@cluster0.rsb1ps8.mongodb.net/?retryWrites=true&w=majority");

        // MongoDatabase db = client.getDatabase("marketdb");

        // MongoCollection<Document> col = db.getCollection("testCollection"); // bson document

        // Document testDoc = new Document("_id", "1").append("name", "John the Ripper");
        // col.insertOne(testDoc);

    }

    @GetMapping("/greetings")
    public ResponseEntity<String> greetings() {
        return new ResponseEntity<String>("Hello from the inside (secured endpoint)", HttpStatus.OK);
    }
}
