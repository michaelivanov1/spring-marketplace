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
import java.util.Map;
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

    public UserStand addToUserStand(String email, Produce produce) {
        // find existing stand
        Optional<UserStand> existingUserStandOp = userStandRepository.findByEmail(email);
        UserStand existingUserStand;
        if (existingUserStandOp.isPresent()) {
            existingUserStand = existingUserStandOp.get();
        } else {
            return new UserStand();
        }

        existingUserStand.addToProduceList(produce);

        userStandRepository.save(existingUserStand);
        return existingUserStand;
    }

    public UserStand updateProduceList(String displayName, String email, ArrayList<Produce> produceList) {
        // find existing stand
        Optional<UserStand> existingUserStandOp = userStandRepository.findByEmail(email);
        UserStand existingUserStand;
        if (existingUserStandOp.isPresent()) {
            existingUserStand = existingUserStandOp.get();
        } else {
            return new UserStand();
        }

        existingUserStand.updateProduceList(produceList);
        existingUserStand.setDisplayName(displayName);
        userStandRepository.save(existingUserStand);
        return existingUserStand;
    }

    public boolean deleteUserStandByEmail(String email) {
        Optional<UserStand> optionalUser = userStandRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            UserStand user = optionalUser.get();
            userStandRepository.delete(user);
            return true;
        }
        return false;
    }

    public Optional<UserStand> singleUserStandById(ObjectId id) {
        return userStandRepository.findById(id);
    }

    public Optional<UserStand> singleUserStandByEmail(String email) {
        return userStandRepository.findByEmail(email);
    }

    public boolean deleteProduceItemByEmailAndFoodName(String email, String foodName) {
        Optional<UserStand> existingUserStandOp = userStandRepository.findByEmail(email);
        if (existingUserStandOp.isPresent()) {
            UserStand existingUserStand = existingUserStandOp.get();

            Optional<Produce> produceToDeleteOp = existingUserStand.getProduceList()
                    .stream()
                    .filter(produce -> produce.getFoodName().equals(foodName))
                    .findFirst();

            if (produceToDeleteOp.isPresent()) {
                Produce produceToDelete = produceToDeleteOp.get();
                existingUserStand.getProduceList().remove(produceToDelete);
                userStandRepository.save(existingUserStand);
                return true;
            }
        }
        return false;
    }
}
