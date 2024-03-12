import {AuthService} from "./auth.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {RegisterRequest} from "../interfaces/registerRequest.interface";
import {LoginRequest} from "../interfaces/loginRequest.interface";
import {expect} from '@jest/globals';
import {SessionInformation} from "../../../interfaces/sessionInformation.interface";

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  const sessionInformationMock: SessionInformation = {
    token: '',
    type: '',
    id: 0,
    username: '',
    firstName: '',
    lastName: '',
    admin: false
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should send a POST request for registration', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    authService.register(registerRequest).subscribe();

    const req = httpTestingController.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerRequest);
  });

  it('should send a POST request for login', () => {
    const loginRequest: LoginRequest = {email: 'test@example.com', password: 'password123'};

    authService.login(loginRequest).subscribe();

    const req = httpTestingController.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);
  });
});
