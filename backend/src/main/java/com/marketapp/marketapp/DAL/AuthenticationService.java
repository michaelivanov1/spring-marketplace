package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.CustomExceptions.EmailAlreadyRegisteredException;
import com.marketapp.marketapp.Enums.Role;
import com.marketapp.marketapp.Security.JwtService;
import com.marketapp.marketapp.ViewModels.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) {

                // make certain email is not already in use
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new EmailAlreadyRegisteredException("Email is already in use", HttpStatus.NOT_ACCEPTABLE);
                }

                SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                Date now = new Date();
                formatter.format(now);
                var user = User.builder()
                                .displayName(request.getDisplayName())
                                .description("")
                                .phoneNumber("")
                                .profileImage("")
                                .creationDate(now)
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.USER)
                                .build();
                userRepository.save(user);
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }
}
