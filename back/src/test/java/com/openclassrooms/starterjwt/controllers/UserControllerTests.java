package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTests {

    private UserController controller;
    private UserService userService;
    private UserMapper mapper;

    @BeforeEach
    public void setUp() {
        mapper = mock(UserMapper.class);
        userService = mock(UserService.class);
        controller = new UserController(userService, mapper);
    }

    @Test
    public void testFindById_Success() {
        String userId = "1";
        User user = User.builder()
                .id(Long.valueOf(userId))
                .email("test@test.com")
                .firstName("First name")
                .lastName("Last name")
                .password("Password")
                .admin(true)
                .build();
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setLastName(user.getLastName());
        userDto.setFirstName(user.getFirstName());
        when(userService.findById(Long.valueOf(userId))).thenReturn(user);
        when(mapper.toDto(user)).thenReturn(userDto);

        ResponseEntity<?> response = controller.findById(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userDto, response.getBody());
        verify(userService, times(1)).findById(Long.valueOf(userId));
        verify(mapper, times(1)).toDto(user);
    }

    @Test
    public void testFindById_NotFound() {
        String userId = "1";
        when(userService.findById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = controller.findById(userId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(userService, times(1)).findById(anyLong());
        verify(mapper, never()).toDto(any(User.class));
    }

    @Test
    public void testFindById_NumberFormatException() {
        String userId = "invalid";

        ResponseEntity<?> response = controller.findById(userId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(userService, never()).findById(anyLong());
        verify(mapper, never()).toDto(any(User.class));
    }

    @Test
    public void testSave_Success() {
        String userId = "1";
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        SecurityContextHolder.setContext(securityContext);
        User user = User.builder()
                .id(Long.valueOf(userId))
                .email("test@test.com")
                .firstName("First name")
                .lastName("Last name")
                .password("Password")
                .admin(true)
                .build();
        when(userService.findById(anyLong())).thenReturn(user);
        UserDetails userDetails = UserDetailsImpl.builder().username(user.getEmail()).build();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        ResponseEntity<?> response = controller.save(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).findById(anyLong());
        verify(userService, times(1)).delete(anyLong());
    }

    @Test
    public void testSave_NotFound() {
        String userId = "1";
        when(userService.findById(Long.valueOf(userId))).thenReturn(null);

        ResponseEntity<?> response = controller.save(userId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(userService, times(1)).findById(anyLong());
        verify(userService, never()).delete(anyLong());
    }

    @Test
    public void testSave_Unauthorized() {
        String userId = "1";
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        SecurityContextHolder.setContext(securityContext);
        User user = User.builder()
                .id(Long.valueOf(userId))
                .email("test@test.com")
                .firstName("First name")
                .lastName("Last name")
                .password("Password")
                .admin(true)
                .build();
        when(userService.findById(anyLong())).thenReturn(user);
        UserDetails userDetails = UserDetailsImpl.builder().username("another@test.com").build();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        ResponseEntity<?> response = controller.save(userId);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(userService, times(1)).findById(anyLong());
        verify(userService, never()).delete(anyLong());
    }
}
