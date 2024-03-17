import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {SessionApiService} from './session-api.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Observable, of} from "rxjs";

describe('SessionsService', () => {
  let mockServiceApi: SessionApiService;
  let mockHttpClient: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });
    mockServiceApi = TestBed.inject(SessionApiService);
    mockHttpClient = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mockHttpClient.verify();
  });

  it('should be created', () => {
    expect(mockServiceApi).toBeTruthy();
  });

  describe('participate', () => {
    let id: string;
    let userId: string;

    beforeEach(() => {
      id = '123';
      userId = '456';
    });

    it('should send a DELETE request to the correct URL with the given parameters', () => {
      const expectedUrl = `api/session/${id}/participate/${userId}`;
      const serviceApiSpy = jest
        .spyOn(mockServiceApi, 'participate')
        .mockReturnValue(of(undefined));
      const observable = mockServiceApi.participate(id, userId);

      expect(serviceApiSpy).toHaveBeenCalledWith(id, userId);
      expect(observable).toBeInstanceOf(Observable);

      observable.subscribe({
        next: () => {
          const req = mockHttpClient.expectOne(expectedUrl);

          expect(req.request.method).toBe('POST');
          expect(req.request.body).toBeNull();

          req.flush(null, { status: 200, statusText: 'Success' });
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
      mockServiceApi.unParticipate(id, userId).subscribe(data => {
        expect(data).toEqual(null);
      });

      const req = mockHttpClient.expectOne(`api/session/${id}/participate/${userId}`);
      expect(req.request.method).toBe('DELETE');

      req.flush(null);
    });

    it('should return an observable of void on successful delete', fakeAsync(() => {
      jest.spyOn(mockServiceApi, 'unParticipate').mockReturnValue(of(undefined));
      const observable = mockServiceApi.unParticipate(id, userId);

      expect(observable).toBeInstanceOf(Observable);
      observable.subscribe({
        next: (data) => {
          expect(data).toBeUndefined();
        }
      });
    }));
  });
});
