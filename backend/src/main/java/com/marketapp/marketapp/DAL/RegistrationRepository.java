package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Account;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistrationRepository extends MongoRepository<Account, ObjectId> {
    //
}
