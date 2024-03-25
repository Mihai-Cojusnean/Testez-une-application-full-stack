package com.openclassrooms.starterjwt.mappers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.mapper.SessionMapperImpl;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest
public class SessionMapperTests {

    @InjectMocks
    private SessionMapperImpl sessionMapper;

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @Test
    public void testToEntity() {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setDescription("Session description");
        sessionDto.setTeacher_id(1L);
        sessionDto.setUsers(Collections.singletonList(2L));
        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName("first name")
                .lastName("last name")
                .build();
        User user = User.builder()
                .id(2L)
                .email("test@test.com")
                .firstName("First name")
                .lastName("Last name")
                .password("Password")
                .admin(true)
                .build();
        when(teacherService.findById(1L)).thenReturn(teacher);
        when(userService.findById(2L)).thenReturn(user);

        Session session = sessionMapper.toEntity(sessionDto);

        assertEquals(sessionDto.getDescription(), session.getDescription());
        assertEquals(teacher, session.getTeacher());
        assertEquals(Collections.singletonList(user), session.getUsers());
    }

    @Test
    public void testToDto() {
        SessionMapper sessionMapper = new SessionMapperImpl();
        Session session = new Session();
        session.setDescription("Session");
        session.setId(1L);
        Teacher teacher = new Teacher();
        teacher.setId(2L);
        session.setTeacher(teacher);
        User user = new User();
        user.setId(3L);
        session.setUsers(Collections.singletonList(user));

        SessionDto sessionDto = sessionMapper.toDto(session);

        assertEquals(session.getDescription(), sessionDto.getDescription());
        assertEquals(teacher.getId(), sessionDto.getTeacher_id());
        assertEquals(Collections.singletonList(user.getId()), sessionDto.getUsers());
    }
}
