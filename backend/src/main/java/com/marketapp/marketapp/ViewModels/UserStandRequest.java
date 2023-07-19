package com.marketapp.marketapp.ViewModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStandRequest {
    //private String id;
    private String email;
    private ArrayList<Produce> produceList;

    // Getters and setters
}