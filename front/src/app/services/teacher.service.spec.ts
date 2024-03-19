import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {TeacherService} from './teacher.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from "@angular/common/http/testing";
import {Teacher} from "../interfaces/teacher.interface";

describe('TeacherService', () => {
  let service: TeacherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService]
    });
    service = TestBed.inject(TeacherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to fetch all teachers', () => {
    const dummyTeachers = [{ id: '1', name: 'Teacher 1' }, { id: '2', name: 'Teacher 2' }];

    service.all().subscribe((teachers: Teacher[])  => {
      expect(teachers).toEqual(dummyTeachers);
    });

    const req: TestRequest = httpTestingController.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTeachers);
  });

  it('should send a GET request to fetch teacher detail by ID', () => {
    const id: string = '1';
    const dummyTeacher = { id: '1', name: 'Teacher Name' };

    service.detail(id).subscribe((teacher: Teacher) => {
      expect(teacher).toEqual(dummyTeacher);
    });

    const req: TestRequest = httpTestingController.expectOne(`api/teacher/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTeacher);
  });
});
