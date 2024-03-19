package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerTests {

    private SessionController controller;
    private SessionService sessionService;
    private SessionMapper mapper;

    @BeforeEach
    public void setUp() {
        mapper = mock(SessionMapper.class);
        sessionService = mock(SessionService.class);
        controller = new SessionController(sessionService, mapper);
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = "ADMIN")
    public void testFindById_SessionFound() {
        Long sessionId = 1L;
        Session expectedSession = Session.builder()
                .id(sessionId)
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
        SessionDto expectedSessionsDto = new SessionDto();
        expectedSessionsDto.setId(sessionId);
        expectedSessionsDto.setName(expectedSession.getName());
        expectedSessionsDto.setDescription(expectedSession.getDescription());
        when(sessionService.getById(sessionId)).thenReturn(expectedSession);
        when(mapper.toDto(expectedSession)).thenReturn(expectedSessionsDto);

        ResponseEntity<?> response = controller.findById("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSessionsDto, response.getBody());
        verify(sessionService, times(1)).getById(sessionId);
        verify(mapper, times(1)).toDto(expectedSession);
    }

    @Test
    @WithMockUser(username = "yoga@studio.com", roles = "ADMIN")
    public void testFindById_SessionNotFound() {
        when(sessionService.getById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = controller.findById("1");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(sessionService, times(1)).getById(anyLong());
    }

    @Test
    public void testFindById_NumberFormatException() {
        String invalidId = "invalid";

        ResponseEntity<?> response = controller.findById(invalidId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(sessionService, never()).getById(anyLong());
    }

    @Test
    public void testFindAll_SessionsFound() {
        List<Session> expectedSessions = List.of(Session.builder()
                .id(1L)
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build());
        SessionDto expectedSessionDto = new SessionDto();
        expectedSessionDto.setId(expectedSessions.get(0).getId());
        expectedSessionDto.setName(expectedSessions.get(0).getName());
        expectedSessionDto.setDescription(expectedSessions.get(0).getDescription());
        List<SessionDto> expectedSessionsDto = List.of(expectedSessionDto);
        when(sessionService.findAll()).thenReturn(expectedSessions);
        when(mapper.toDto(expectedSessions)).thenReturn(expectedSessionsDto);

        ResponseEntity<?> response = controller.findAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSessions.size(), expectedSessionsDto.size());
        assertEquals(expectedSessionsDto, response.getBody());
        verify(sessionService, times(1)).findAll();
    }

    @Test
    public void testFindAll_NoSessionFound() {
        List<Session> expectedSessions = Collections.emptyList();
        List<SessionDto> expectedSessionsDto = Collections.emptyList();
        when(sessionService.findAll()).thenReturn(expectedSessions);
        when(mapper.toDto(expectedSessions)).thenReturn(expectedSessionsDto);

        ResponseEntity<?> response = controller.findAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSessionsDto, response.getBody());
        verify(sessionService, times(1)).findAll();
    }

    @Test
    public void testCreate_Success() {
        Long sessionId = 1L;
        Session expectedSession = Session.builder()
                .id(sessionId)
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
        SessionDto expectedSessionDto = new SessionDto();
        expectedSessionDto.setId(expectedSession.getId());
        expectedSessionDto.setName(expectedSession.getName());
        expectedSessionDto.setDescription(expectedSession.getDescription());

        when(sessionService.create(any(Session.class))).thenReturn(expectedSession);
        when(mapper.toEntity(expectedSessionDto)).thenReturn(expectedSession);
        when(mapper.toDto(expectedSession)).thenReturn(expectedSessionDto);

        ResponseEntity<?> response = controller.create(expectedSessionDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSessionDto, response.getBody());
        verify(sessionService, times(1)).create(any(Session.class));
        verify(mapper, times(1)).toEntity(expectedSessionDto);
        verify(mapper, times(1)).toDto(expectedSession);
    }

    @Test
    public void testUpdate_Success() {
        String sessionId = "1";
        Session expectedSession = Session.builder()
                .id(Long.valueOf(sessionId))
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
        SessionDto expectedSessionDto = new SessionDto();
        expectedSessionDto.setId(expectedSession.getId());
        expectedSessionDto.setName(expectedSession.getName());
        expectedSessionDto.setDescription(expectedSession.getDescription());
        when(sessionService.update(anyLong(), any(Session.class))).thenReturn(expectedSession);
        when(mapper.toEntity(expectedSessionDto)).thenReturn(expectedSession);
        when(mapper.toDto(expectedSession)).thenReturn(expectedSessionDto);

        ResponseEntity<?> response = controller.update(sessionId, expectedSessionDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedSessionDto, response.getBody());
        verify(sessionService, times(1)).update(anyLong(), any(Session.class));
        verify(mapper, times(1)).toEntity(expectedSessionDto);
        verify(mapper, times(1)).toDto(expectedSession);
    }

    @Test
    public void testDelete_Success() {
        String sessionId = "1";
        Session expectedSession = Session.builder()
                .id(Long.valueOf(sessionId))
                .name("Session")
                .date(new Date())
                .description("Session description")
                .teacher(new Teacher())
                .users(new ArrayList<>())
                .build();
        when(sessionService.getById(anyLong())).thenReturn(expectedSession);

        ResponseEntity<?> response = controller.save(sessionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService, times(1)).getById(anyLong());
        verify(sessionService, times(1)).delete(anyLong());
    }

    @Test
    public void testDelete_NotFound() {
        String sessionId = "1";
        when(sessionService.getById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = controller.save(sessionId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(sessionService, times(1)).getById(anyLong());
        verify(sessionService, never()).delete(anyLong());
    }

    @Test
    public void testDelete_BadRequest() {
        String sessionId = "invalid";

        ResponseEntity<?> response = controller.save(sessionId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(sessionService, never()).getById(anyLong());
    }

    @Test
    public void testParticipate_Success() {
        String id = "1";
        String userId = "2";

        ResponseEntity<?> response = controller.participate(id, userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService).participate(Long.parseLong(id), Long.parseLong(userId));
    }

    @Test
    public void testParticipate_BadRequest() {
        String id = "invalid_id";
        String userId = "2";

        ResponseEntity<?> response = controller.participate(id, userId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(sessionService, never()).participate(anyLong(), anyLong());
    }

    @Test
    public void testNoLongerParticipate_Success() {
        String id = "1";
        String userId = "2";

        ResponseEntity<?> response = controller.noLongerParticipate(id, userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(sessionService).noLongerParticipate(Long.parseLong(id), Long.parseLong(userId));
    }

    @Test
    public void testNoLongerParticipate_BadRequest() {
        String id = "invalid_id";
        String userId = "2";

        ResponseEntity<?> response = controller.noLongerParticipate(id, userId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(sessionService, never()).noLongerParticipate(anyLong(), anyLong());
    }
}
