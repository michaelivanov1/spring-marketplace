/*
 * File Name: FarmerStandRepository.java
 * Author(s): L. Bas, D. Mahyuddin, M. Ivanov
 * Date Created: 2023-05-24
 */

package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.FarmerStand;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerStandRepository extends MongoRepository<FarmerStand, ObjectId> {
    //
    Optional<FarmerStand> findFarmerStandByAccountName(String accountName);
}
