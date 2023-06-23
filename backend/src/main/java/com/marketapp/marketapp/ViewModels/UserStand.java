/*
 * File Name: UserStand.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-05-24
 */

package com.marketapp.marketapp.ViewModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Document(collection = "user_stands")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class UserStand { // we don't need a stand name / farm name because it will be linked accordingly


    @Id
    private ObjectId id;

    private String email;
    private String profileName;
    private ArrayList<Produce> produceList;

    public UserStand(User user, ArrayList<Produce> produceList) {

        this.email = user.getEmail();
        this.profileName = user.getProfileName(); //if a non-existent accountName is given, profile name will be null
        this.produceList = produceList;
    }
}
