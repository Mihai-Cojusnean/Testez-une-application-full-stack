package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UserServiceTests {

    private UserRepository userRepo;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepo = mock(UserRepository.class);
        userService = new UserService(userRepo);
    }

    @Test
    public void testFindById_UserFound() {
        Long userId = 1L;
        User user = User.builder()
                .id(userId)
                .email("test@test.com")
                .firstName("First name")
                .lastName("Last name")
                .password("Password")
                .admin(true)
                .build();
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        User userFound = userService.findById(userId);

        Assertions.assertThat(userFound).isNotNull();
    }

    @Test
    void testFindById_UserNotFound() {
        Long userId = 2L;
        when(userRepo.findById(userId)).thenReturn(Optional.empty());

        User foundUser = userService.findById(userId);

        assertNull(foundUser);
    }

    @Test
    public void testDeleteById() {
        Long userId = 1L;

        userService.delete(userId);

        verify(userRepo, times(1)).deleteById(userId);
    }
}
