package com.openclassrooms.starterjwt.controllers.integration;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;

    private static UserRepository userRepository;
    private static String token;
    private static List<User> users;

    @BeforeAll
    static void setUpAll(@Autowired UserRepository userRepository,
                         @Autowired PasswordEncoder passwordEncoder,
                         @Autowired AuthenticationManager authenticationManager,
                         @Autowired JwtUtils jwtUtils) {
        UserControllerTests.userRepository = userRepository;

        User userOne = new User()
                .setEmail("admin@test.com")
                .setLastName("First name")
                .setFirstName("Last name")
                .setPassword(passwordEncoder.encode("Password123!"))
                .setAdmin(true);
        userRepository.save(userOne);

        User userTwo = new User()
                .setEmail("user@gmail.com")
                .setLastName("First name")
                .setFirstName("Last name")
                .setPassword(passwordEncoder.encode("Password123!"))
                .setAdmin(false);
        userRepository.save(userTwo);

        Optional<User> optUser = userRepository.findByEmail("admin@test.com");
        Optional<User> optUserTwo = userRepository.findByEmail("user@gmail.com");

        if (optUser.isPresent() && optUserTwo.isPresent()) {
            users = new ArrayList<>();
            users.add(optUser.get());
            users.add(optUserTwo.get());
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        "admin@test.com",
                        "Password123!"));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        token = jwtUtils.generateJwtToken(authentication);
    }

    @AfterAll
    static void cleanUp() {
        userRepository.deleteAll(users);
    }

    @Test
    public void testFindById() throws Exception {
        User user = userRepository.findByEmail("admin@test.com")
                .orElseThrow(() -> new RuntimeException("User not found"));
        mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .get("/api/user/{id}", user.getId())
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("First name"))
                .andReturn();
    }

    @Test
    public void testDelete() throws Exception {
        User user = userRepository.findByEmail("admin@test.com")
                .orElseThrow(() -> new RuntimeException("User not found"));
        mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .delete("/api/user/{id}", user.getId())
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}
