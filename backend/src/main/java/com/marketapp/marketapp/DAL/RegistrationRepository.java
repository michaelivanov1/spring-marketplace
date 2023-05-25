package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Account;
import com.marketapp.marketapp.ViewModels.Farmer;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.Optional;

@Repository
public interface RegistrationRepository extends MongoRepository<Account, ObjectId> {
    Account findAccountByEmail(String email);

}
