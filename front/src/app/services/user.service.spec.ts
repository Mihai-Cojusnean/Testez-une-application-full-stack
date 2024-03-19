import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {UserService} from './user.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from "@angular/common/http/testing";
import {User} from "../interfaces/user.interface";

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to fetch user by ID', () => {
    const id: string = '1';
    const dummyUser = { id: '1', name: 'Test User' };

    service.getById(id).subscribe((user: User) => {
      expect(user).toEqual(dummyUser);
    });

    const req: TestRequest = httpTestingController.expectOne(`api/user/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should send a DELETE request to delete user by ID', () => {
    const id: string = '1';

    service.delete(id).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req: TestRequest = httpTestingController.expectOne(`api/user/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
