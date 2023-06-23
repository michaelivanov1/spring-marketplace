/*
 * File Name: UserStandService.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-05-24
 */

package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserStandService {

    @Autowired
    private UserStandRepository userStandRepository;

    public List<UserStand> allUserStands() {
        return userStandRepository.findAll();
    }

    public UserStand createUserStand(User user, ArrayList<Produce> produceList) {
        return userStandRepository.insert(new UserStand(user, produceList));
    }

    public Optional<UserStand> singleUserStandById(ObjectId id) {
        return userStandRepository.findById(id);
    }

    public Optional<UserStand> singleUserStandByEmail(String email) {
        return userStandRepository.findUserStandByEmail(email);
    }
}
