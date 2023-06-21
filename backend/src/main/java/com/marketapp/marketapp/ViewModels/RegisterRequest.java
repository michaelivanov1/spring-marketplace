package com.marketapp.marketapp.ViewModels;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest { //TODO: here we will add more details when we merge farmer
    private String email;
    private String password;
}
