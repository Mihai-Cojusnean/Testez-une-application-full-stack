import {fakeAsync, TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {SessionApiService} from './session-api.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from "@angular/common/http/testing";
import {Observable, of} from "rxjs";
import {Session} from "../interfaces/session.interface";

describe('SessionsService', () => {
  let serviceApiMock: SessionApiService;
  let httpClientMock: HttpTestingController;

  const sessionsMock: Session[] = [{
    name: 'Test',
    description: 'Description Test',
    date: new Date(),
    teacher_id: 2,
    users: []
  }];

  const sessionMock: Session = {
    name: 'Test',
    description: 'Description Test',
    date: new Date(),
    teacher_id: 2,
    users: [1]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });
    serviceApiMock = TestBed.inject(SessionApiService);
    httpClientMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpClientMock.verify();
  });

  it('should be created', () => {
    expect(serviceApiMock).toBeTruthy();
  });

  it('should retrieve all sessions from the API via GET', () => {
    serviceApiMock.all().subscribe(sessions => {
      expect(sessions).toEqual(sessionsMock);
    });
    const request: TestRequest = httpClientMock.expectOne('api/session');
    expect(request.request.method).toBe('GET');
    request.flush(sessionsMock);
  });

  it('should retrieve session detail from the API via GET', () => {
    serviceApiMock.detail('1').subscribe(session => {
      expect(session).toEqual(sessionMock);
    });
    const request: TestRequest = httpClientMock.expectOne('api/session/1');
    expect(request.request.method).toBe('GET');
    request.flush(sessionsMock);
  });

  it('should create session via POST', () => {
    serviceApiMock.create(sessionMock).subscribe(session => {
      expect(session).toEqual(sessionMock);
    });
    const request: TestRequest = httpClientMock.expectOne('api/session');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(sessionMock);
    request.flush(sessionsMock);
  });

  it('should update session via PUT', () => {
    const sessionId: string = '1';
    serviceApiMock.update(sessionId, sessionMock).subscribe(session => {
      expect(session).toEqual(sessionMock);
    });
    const request: TestRequest = httpClientMock.expectOne(`api/session/${sessionId}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(sessionMock);
    request.flush(sessionsMock);
  });

  describe('participate', () => {
    let id: string;
    let userId: string;

    beforeEach(() => {
      id = '123';
      userId = '456';
    });

    it('should send a POST request to the correct URL with the given parameters', () => {
      const expectedUrl: string = `api/session/${id}/participate/${userId}`;
      const serviceApiMockApiSpy = jest
        .spyOn(serviceApiMock, 'participate')
        .mockReturnValue(of(undefined));
      const observable = serviceApiMock.participate(id, userId);

      expect(serviceApiMockApiSpy).toHaveBeenCalledWith(id, userId);
      expect(observable).toBeInstanceOf(Observable);

      observable.subscribe({
        next: () => {
          const req: TestRequest = httpClientMock.expectOne(expectedUrl);

          expect(req.request.method).toBe('POST');
          expect(req.request.body).toBeNull();

          req.flush(null, {status: 200, statusText: 'Success'});
        },
      });
    });
  });

  describe('unParticipate', () => {
    let id: string;
    let userId: string;

    beforeEach(() => {
      id = '123';
      userId = '456';
    });

    it('should send a DELETE request to the correct URL with the given parameters', () => {
      serviceApiMock.unParticipate(id, userId).subscribe(data => {
        expect(data).toEqual(null);
      });

      const req: TestRequest = httpClientMock.expectOne(`api/session/${id}/participate/${userId}`);
      expect(req.request.method).toBe('DELETE');

      req.flush(null);
    });

    it('should return an observable of void on successful delete', fakeAsync(() => {
      jest.spyOn(serviceApiMock, 'unParticipate').mockReturnValue(of(undefined));
      const observable: Observable<void> = serviceApiMock.unParticipate(id, userId);

      expect(observable).toBeInstanceOf(Observable);
      observable.subscribe({
        next: (data) => {
          expect(data).toBeUndefined();
        }
      });
    }));
  });
});
