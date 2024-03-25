package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@SpringBootTest
public class SessionServiceTests {

    private SessionRepository sessionRepo;
    private UserRepository userRepo;
    private SessionService sessionService;

    @BeforeEach
    public void setUp() {
        sessionRepo = mock(SessionRepository.class);
        userRepo = mock(UserRepository.class);
        sessionService = new SessionService(sessionRepo, userRepo);
    }

    @Test
    public void testCreateSession() {
        Session newSession = Session.builder()
                .id(1L)
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
        when(sessionRepo.save(newSession)).thenReturn(newSession);

        Session savedSession = sessionService.create(newSession);

        assertNotNull(savedSession);
        assertEquals(newSession, savedSession);
        verify(sessionRepo, times(1)).save(savedSession);
    }

    @Test
    public void testDeleteSession() {
        Long sessionId = 1L;

        sessionService.delete(sessionId);

        verify(sessionRepo, times(1)).deleteById(sessionId);
    }

    @Test
    public void testFindAllSessions_WithSessions() {
        List<Session> expectedSessions = List.of(
                Session.builder()
                        .id(1L)
                        .name("Session 1")
                        .date(new Date())
                        .description("Session description 1")
                        .teacher(new Teacher())
                        .users(new ArrayList<>())
                        .build(),
                Session.builder()
                        .id(2L)
                        .name("Session 2")
                        .date(new Date())
                        .description("Session description 2")
                        .teacher(new Teacher())
                        .users(new ArrayList<>())
                        .build()
        );
        when(sessionRepo.findAll()).thenReturn(expectedSessions);

        List<Session> actualSession = sessionService.findAll();

        assertNotNull(actualSession);
        assertEquals(expectedSessions.size(), actualSession.size());
        assertEquals(expectedSessions, actualSession);
        verify(sessionRepo, times(1)).findAll();
    }

    @Test
    public void testFindAllSessions_NoSessions() {
        when(sessionRepo.findAll()).thenReturn(Collections.emptyList());

        List<Session> actualSessions = sessionService.findAll();

        assertTrue(actualSessions.isEmpty());
        verify(sessionRepo, times(1)).findAll();
    }

    @Test
    public void testGetSessionById_SessionFound() {
        Long sessionId = 1L;
        Session expectedSession = Session.builder()
                .id(sessionId)
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.of(expectedSession));

        Session actualSession = sessionRepo.findById(sessionId).get();

        assertNotNull(actualSession);
        assertEquals(expectedSession, actualSession);
        verify(sessionRepo, times(1)).findById(sessionId);
    }

    @Test
    public void testGetSessionById_SessionNotFound() {
        Long sessionId = 2L;
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.empty());

        Session actualSession = sessionService.getById(sessionId);

        assertNull(actualSession);
        verify(sessionRepo, times(1)).findById(sessionId);
    }

    @Test
    public void testUpdateSession() {
        Long sessionId = 1L;
        Session originalSession = Session.builder()
                .id(sessionId)
                .name("Updated session")
                .date(new Date())
                .description("Updated session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();

        when(sessionRepo.save(originalSession)).thenReturn(originalSession);

        Session updatedSession = sessionService.update(sessionId, originalSession);

        assertNotNull(updatedSession);
        assertEquals(originalSession, updatedSession);
        verify(sessionRepo, times(1)).save(updatedSession);
    }

    @Test
    public void testParticipate_Success() {
        Long sessionId = 1L, userId = 2L;
        Session session = Session.builder()
                .id(sessionId)
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
        User user = User.builder()
                .id(userId)
                .email("test@test.com")
                .firstName("First name")
                .lastName("Last name")
                .password("Password")
                .admin(true)
                .build();
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        sessionService.participate(sessionId, userId);

        assertTrue(session.getUsers().contains(user));
        verify(sessionRepo, times(1)).save(session);
    }

    @Test
    public void testParticipate_SessionNotFound() {
        Long sessionId = 1L;
        Long userId = 2L;

        when(sessionRepo.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
        verify(sessionRepo, times(1)).findById(sessionId);
    }

    @Test
    public void testParticipate_UserNotFound() {
        Long sessionId = 1L, userId = 2L;
        Session session = Session.builder()
                .id(sessionId)
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();

        when(sessionRepo.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepo.findById(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
        verify(sessionRepo, times(1)).findById(sessionId);
        verify(userRepo, times(1)).findById(userId);
    }

    @Test
    public void testParticipate_AlreadyParticipating() {
        Long sessionId = 1L, userId = 2L;
        Session session = Session.builder()
                .id(sessionId)
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
        User user = User.builder()
                .id(userId)
                .email("test@test.com")
                .firstName("First name")
                .lastName("Last name")
                .password("Password")
                .admin(true)
                .build();
        session.getUsers().add(user);

        when(sessionRepo.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
        verify(sessionRepo, times(1)).findById(sessionId);
        verify(userRepo, times(1)).findById(userId);
    }

    @Test
    public void testNoLongerParticipate_Success() {
        Long sessionId = 1L, userId = 2L;
        Session session = Session.builder()
                .id(sessionId)
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
        User user = User.builder()
                .id(userId)
                .email("test@test.com")
                .firstName("First name")
                .lastName("Last name")
                .password("Password")
                .admin(true)
                .build();
        session.getUsers().add(user);
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(sessionId, userId);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepo, times(1)).findById(sessionId);
    }

    @Test
    public void testNoLongerParticipate_SessionNotFound() {
        Long sessionId = 1L, userId = 2L;
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
        verify(sessionRepo, times(1)).findById(sessionId);
    }

    @Test
    public void testNoLongerParticipate_NotParticipating() {
        Long sessionId = 1L, userId = 2L;
        Session session = Session.builder()
                .id(sessionId)
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
        verify(sessionRepo, times(1)).findById(sessionId);
        verify(sessionRepo, never()).save(session);
    }
}
