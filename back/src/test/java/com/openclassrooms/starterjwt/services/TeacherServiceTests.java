package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class TeacherServiceTests {

    @Mock
    private TeacherRepository teacherRepo;
    private TeacherService teacherService;

    @BeforeEach
    public void setUp() {
        teacherRepo = mock(TeacherRepository.class);
        teacherService = new TeacherService(teacherRepo);
    }

    @Test
    public void testFindAll_WithTeachers() {
        List<Teacher> expectedTeachers = List.of(
                Teacher.builder()
                        .id(1L)
                        .firstName("first name")
                        .lastName("last name")
                        .build(),
                Teacher.builder()
                        .id(2L)
                        .firstName("first name 2")
                        .lastName("last name 2")
                        .build());
        when(teacherRepo.findAll()).thenReturn(expectedTeachers);

        List<Teacher> actualTeachers = teacherService.findAll();

        assertEquals(expectedTeachers.size(), actualTeachers.size());
        assertEquals(expectedTeachers, actualTeachers);
        verify(teacherRepo, times(1)).findAll();
    }

    @Test
    public void testFindAll_NoTeachers() {
        when(teacherRepo.findAll()).thenReturn(Collections.emptyList());

        List<Teacher> actualTeachers = teacherService.findAll();

        assertTrue(actualTeachers.isEmpty());
        verify(teacherRepo, times(1)).findAll();
    }

    @Test
    public void testFindById_TeacherFound() {
        Long teacherId = 1L;
        Teacher expectedTeacher = Teacher.builder()
                .id(1L)
                .firstName("first name")
                .lastName("last name")
                .build();

        when(teacherRepo.findById(teacherId)).thenReturn(Optional.of(expectedTeacher));

        Teacher actualTeacher = teacherService.findById(teacherId);

        assertNotNull(actualTeacher);
        assertEquals(expectedTeacher, actualTeacher);
        verify(teacherRepo, times(1)).findById(teacherId);
    }

    @Test
    public void testFindById_TeacherNotFound() {
        Long teacherId = 2L;

        when(teacherRepo.findById(teacherId)).thenReturn(Optional.empty());

        Teacher actualTeacher = teacherService.findById(teacherId);

        assertNull(actualTeacher);
        verify(teacherRepo, times(1)).findById(teacherId);
    }
}
