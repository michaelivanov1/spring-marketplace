/*
 * File Name: UserStandRepository.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-05-24
 */

package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.UserStand;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStandRepository extends MongoRepository<UserStand, ObjectId> {
    Optional<UserStand> findByEmail(String email);
}
