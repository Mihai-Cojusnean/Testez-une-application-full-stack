import {TestBed} from '@angular/core/testing';
import {expect} from '@jest/globals';

import {SessionService} from './session.service';
import {BehaviorSubject} from "rxjs";
import {SessionApiService} from "../features/sessions/services/session-api.service";
import {SessionInformation} from "../interfaces/sessionInformation.interface";

describe('SessionService', () => {
  let service: SessionService;
  let isLoggedSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionApiService],
    });
    service = TestBed.inject(SessionService);
    isLoggedSubject = service['isLoggedSubject'];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit isLogged value correctly when calling logIn', () => {
    const user: SessionInformation = {
      token: '',
      type: '',
      id: 1,
      username: '',
      firstName: '',
      lastName: '',
      admin: true
    };
    jest.spyOn(isLoggedSubject, 'next');
    service.logIn(user);
    expect(service.isLogged).toBeTruthy();
    expect(isLoggedSubject.next).toHaveBeenCalledWith(true);
  });

  it('should emit isLogged value correctly when calling logOut', () => {
    jest.spyOn(isLoggedSubject, 'next');
    service.logOut();
    expect(service.isLogged).toBeFalsy();
    expect(isLoggedSubject.next).toHaveBeenCalledWith(false);
  });

  it('should return correct value for $isLogged', () => {
    const user: SessionInformation = {
      token: '',
      type: '',
      id: 1,
      username: '',
      firstName: '',
      lastName: '',
      admin: true
    };
    let isLoggedValue: boolean | undefined;
    service.$isLogged().subscribe(isLogged => {
      isLoggedValue = isLogged;
    });
    expect(isLoggedValue).toBeFalsy();

    service.logIn(user);
    expect(isLoggedValue).toBeTruthy();

    service.logOut();
    expect(isLoggedValue).toBeFalsy();
  });
});
