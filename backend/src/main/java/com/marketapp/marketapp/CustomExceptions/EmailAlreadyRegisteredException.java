package com.marketapp.marketapp.CustomExceptions;


import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class EmailAlreadyRegisteredException extends RuntimeException {
    private final HttpStatus httpStatus;

    public EmailAlreadyRegisteredException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
