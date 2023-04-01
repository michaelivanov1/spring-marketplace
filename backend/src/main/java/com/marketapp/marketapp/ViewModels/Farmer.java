/*
 * File Name: Farmer.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-03-31
 */

package com.marketapp.marketapp.ViewModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "farmers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Farmer {

    @Id
    private ObjectId id;

    private String accountName;
    private String profileName;
    private String email;
    private String phoneNumber;
    private String profileImageURI;
    private String profileBannerURI;

    //custom constructor without objectId
    public Farmer(String accountName, String profileName, String email, String phoneNumber,
                  String profileImageURI, String profileBannerURI) {

        this.accountName = accountName;
        this.profileName = profileName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.profileImageURI = profileImageURI;
        this.profileBannerURI = profileBannerURI;
    }
}
