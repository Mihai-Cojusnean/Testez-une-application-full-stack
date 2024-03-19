package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class TeacherControllerTests {

    private TeacherController controller;
    private TeacherService teacherService;
    private TeacherMapper mapper;

    @BeforeEach
    public void setUp() {
        mapper = mock(TeacherMapper.class);
        teacherService = mock(TeacherService.class);
        controller = new TeacherController(teacherService, mapper);
    }

    @Test
    public void testFindById_Success() {
        String teacherId = "1";
        Teacher teacher = Teacher.builder()
                .id(Long.valueOf(teacherId))
                .lastName("Last name")
                .firstName("First name")
                .build();
        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(teacher.getId());
        teacherDto.setLastName(teacher.getLastName());
        teacherDto.setFirstName(teacher.getFirstName());
        when(teacherService.findById(Long.valueOf(teacherId))).thenReturn(teacher);
        when(mapper.toDto(teacher)).thenReturn(teacherDto);

        ResponseEntity<?> response = controller.findById(teacherId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(teacherDto, response.getBody());
        verify(teacherService, times(1)).findById(Long.valueOf(teacherId));
        verify(mapper, times(1)).toDto(teacher);
    }

    @Test
    public void testFindById_NotFound() {
        String teacherId = "1";
        when(teacherService.findById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = controller.findById(teacherId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(teacherService, times(1)).findById(anyLong());
        verify(mapper, never()).toDto(any(Teacher.class));
    }

    @Test
    public void testFindById_NumberFormatException() {
        String teacherId = "invalid";

        ResponseEntity<?> response = controller.findById(teacherId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(teacherService, never()).findById(anyLong());
        verify(mapper, never()).toDto(any(Teacher.class));
    }

    @Test
    public void testFindAll_TeachersFound() {
        List<Teacher> teachers = new ArrayList<>();
        teachers.add(new Teacher());
        when(teacherService.findAll()).thenReturn(teachers);
        when(mapper.toDto(teachers)).thenReturn(new ArrayList<>());

        ResponseEntity<?> response = controller.findAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
