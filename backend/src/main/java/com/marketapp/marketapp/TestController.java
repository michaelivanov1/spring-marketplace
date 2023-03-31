/*
 * File Name: TestController.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-03-01
 */

package com.marketapp.marketapp;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class TestController {

    @RequestMapping("/test")
    public String test() {

        /*MongoClient client = MongoClients.create("mongodb+srv://admin:KqZVIcWcbn5jHe4Q@cluster0.rsb1ps8.mongodb.net/?retryWrites=true&w=majority");
        MongoDatabase db = client.getDatabase("marketdb");
        MongoCollection<Document> col = db.getCollection("testCollection"); //bson document

        Document testDoc = new Document("_id", "1").append("name", "John the Ripper");
        col.insertOne(testDoc);*/

        return "Hello World!";

    }
}
