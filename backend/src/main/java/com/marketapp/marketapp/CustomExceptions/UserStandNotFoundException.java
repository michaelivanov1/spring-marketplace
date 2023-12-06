package com.marketapp.marketapp.CustomExceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class UserStandNotFoundException extends RuntimeException {
    private final HttpStatus httpStatus;

    public UserStandNotFoundException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
