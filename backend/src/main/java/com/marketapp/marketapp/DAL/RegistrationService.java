package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Account;
import com.marketapp.marketapp.ViewModels.Farmer;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    public List<Account> allAccounts() {
        return registrationRepository.findAll();
    }

    public Account singleAccountByEmail(String email) {
        return registrationRepository.findAccountByEmail(email);
    }

    public Optional<Account> singleAccountById(ObjectId id) {
        return registrationRepository.findById(id);
    }

    public Account singleAccountByUsername(String username) {
        return registrationRepository.findAccountByUsername(username);
    }

    public Account createAccount(String username, String email, String password) {
        Account account = registrationRepository.insert(new Account(username, email, password));
        return account;
    }

}
