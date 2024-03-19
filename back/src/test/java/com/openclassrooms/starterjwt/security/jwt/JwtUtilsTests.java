package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class JwtUtilsTests {

    private JwtUtils jwtUtils;

    @BeforeEach
    public void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "secret");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000);
    }

    @Test
    public void testGenerateJwtToken() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .username("Test user")
                .build();
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);

        assertTrue(token != null && !token.isEmpty());
        verify(authentication, times(1)).getPrincipal();
    }

    @Test
    public void testGetUserNameFromJwtToken() {
        String token = Jwts.builder()
                .setSubject("Test user")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SignatureAlgorithm.HS512, "secret")
                .compact();

        String username = jwtUtils.getUserNameFromJwtToken(token);

        assertEquals("Test user", username);
    }

    @Test
    public void testValidateJwtToken_ValidToken() {
        String token = Jwts.builder()
                .setSubject("Test user")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(SignatureAlgorithm.HS512, "secret")
                .compact();

        boolean isValid = jwtUtils.validateJwtToken(token);

        assertTrue(isValid);
    }

    @Test
    public void testValidateJwtToken_InvalidToken() {
        boolean isValid = jwtUtils.validateJwtToken("invalidToken");

        assertFalse(isValid);
    }

}
