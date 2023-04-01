/*
 * File Name: FarmerRepository.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-03-31
 */

package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Farmer;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerRepository extends MongoRepository<Farmer, ObjectId> {
    Optional<Farmer> findFarmerByAccountName(String accountName);
}
