package com.openclassrooms.starterjwt.controllers.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.services.SessionService;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class SessionControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionService sessionService;

    private final ObjectMapper mapper = new ObjectMapper();

    private static AuthenticationManager authenticationManager;
    private static JwtUtils jwtUtils;
    private static String token;

    @BeforeAll
    static void setUpAll(@Autowired AuthenticationManager authenticationManager,
                         @Autowired JwtUtils jwtUtils) {
        SessionControllerTests.authenticationManager = authenticationManager;
        SessionControllerTests.jwtUtils = jwtUtils;

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        "yoga@studio.com",
                        "test!1234"));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        token = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    public void testFindById() throws Exception {
        Session session = Session.builder()
                .name("Session")
                .date(new Date())
                .description("Session description")
                .build();
        session = sessionService.create(session);

        mockMvc.perform(get("/api/session/{id}", session.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Session"))
                .andExpect(jsonPath("$.description").value("Session description"));
    }

    @Test
    public void testFindAll() throws Exception {
        mockMvc.perform(get("/api/session")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testCreate() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("New Session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
        sessionDto.setDescription("New Description");

        mockMvc.perform(post("/api/session")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Session"))
                .andExpect(jsonPath("$.description").value("New Description"));
    }

    @Test
    public void testUpdate() throws Exception {
        Session session = Session.builder()
                .name("Session")
                .date(new Date())
                .description("Session description")
                .build();
        session = sessionService.create(session);

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Updated Session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
        sessionDto.setDescription("Updated Description");

        mockMvc.perform(put("/api/session/{id}", session.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Session"))
                .andExpect(jsonPath("$.description").value("Updated Description"));
    }

    @Test
    public void testSave() throws Exception {
        Session session = Session.builder()
                .name("Session")
                .date(new Date())
                .description("Session description")
                .build();
        session = sessionService.create(session);

        mockMvc.perform(delete("/api/session/{id}", session.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/session/{id}", session.getId())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testParticipate() throws Exception {
        Session session = Session.builder()
                .name("Session")
                .date(new Date())
                .description("Session description")
                .users(new ArrayList<>())
                .build();
        session = sessionService.create(session);

        mockMvc.perform(post("/api/session/{id}/participate/{userId}", session.getId(), 1L)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    public void testNoLongerParticipate() throws Exception {
        User user = User.builder()
                .id(1L)
                .email("test@test.com")
                .firstName("First name")
                .lastName("Last name")
                .password("Password")
                .admin(true)
                .build();
        Session session = Session.builder()
                .name("Session")
                .date(new Date())
                .description("Session description")
                .users(List.of(user))
                .build();
        session = sessionService.create(session);

        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", session.getId(), 1L)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());
    }
}