package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.Enums.Role;
import com.marketapp.marketapp.ViewModels.User;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> allUsers() {
        return userRepository.findAll();
    }

    public Optional<User> singleUserById(ObjectId id) {
        return userRepository.findById(id);
    }

    public Optional<User> singleUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(ObjectId id, User updatedUser) {
        User existingUser = userRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("User not found with ID: " + id));

        existingUser.setDisplayName(updatedUser.getDisplayName());
        existingUser.setDescription(updatedUser.getDescription());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        existingUser.setProfileImage(updatedUser.getProfileImage());
        existingUser.setBannerImage(updatedUser.getBannerImage());
        existingUser.setCreationDate(existingUser.getCreationDate());
        existingUser.setRole(Role.USER);

        return userRepository.save(existingUser);
    }

}
