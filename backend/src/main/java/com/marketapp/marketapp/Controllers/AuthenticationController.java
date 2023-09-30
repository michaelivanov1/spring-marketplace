package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.AuthenticationService;
import com.marketapp.marketapp.ViewModels.AuthenticationRequest;
import com.marketapp.marketapp.ViewModels.AuthenticationResponse;
import com.marketapp.marketapp.ViewModels.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:8080", "https://spring-marketplace-client.onrender.com" })
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return new ResponseEntity<AuthenticationResponse>(authenticationService.register(request),
                HttpStatus.CREATED);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody AuthenticationRequest request) {
        return new ResponseEntity<AuthenticationResponse>(authenticationService.authenticate(request),
                HttpStatus.OK);
    }
}
