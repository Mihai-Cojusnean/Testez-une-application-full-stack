package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UserDetailsServiceImplTests {

    private UserRepository userRepo;
    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    public void setUp() {
        userRepo = mock(UserRepository.class);
        userDetailsService = new UserDetailsServiceImpl(userRepo);
    }

    @Test
    public void testLoadUserByUsername_Success() {
        String username = "test@test.com";
        User user = User.builder()
                .id(1L)
                .email(username)
                .firstName("First name")
                .lastName("Last name")
                .password("Password")
                .admin(true)
                .build();
        when(userRepo.findByEmail(eq(username))).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        assertEquals(username, userDetails.getUsername());

        assertNotNull(userDetails);
        assertEquals(username, userDetails.getUsername());
        assertEquals(user.getEmail(), userDetails.getUsername());
        verify(userRepo, times(1)).findByEmail(eq(username));
    }

    @Test
    public void testLoadUserByUsername_UserNotFound() {
        String username = "test@test.com";
        when(userRepo.findByEmail(username)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername(username);
        });
    }
}
