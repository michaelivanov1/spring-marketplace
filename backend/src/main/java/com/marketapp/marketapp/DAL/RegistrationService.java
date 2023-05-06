package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.Account;
import com.marketapp.marketapp.ViewModels.Farmer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    public List<Account> allAccounts() {
        return registrationRepository.findAll();
    }

    public Account createAccount(String username, String email, String password) {
        Account account = registrationRepository.insert(new Account(username, email, password));
        return account;
    }

}
