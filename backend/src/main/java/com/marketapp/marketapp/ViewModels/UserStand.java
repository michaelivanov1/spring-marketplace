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
public class UserStand { 

    @Id
    private ObjectId id;

    private String email;
    private String displayName;
    private ArrayList<Produce> produceList;

    public void addToProduceList(Produce produce) {
        this.produceList.add(produce);
    }

    public void updateProduceList(ArrayList<Produce> produceList) {
        this.produceList = produceList;
    }

    public int findIndexOfProduce(String produceName) {
        int index = 0;
        for (Produce obj : this.produceList) {
            if (obj.getFoodName().equals(produceName)) {
                return index;
            }
            index++;
        }
        return -1; //means error in which there is no matching produce name
    }

    public UserStand(User user, ArrayList<Produce> produceList) {

        this.email = user.getEmail();
        this.displayName = user.getDisplayName(); // if a non-existent accountName is given, profile name will be null
        this.produceList = produceList;
    }
}
