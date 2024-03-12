import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {expect} from '@jest/globals';

import {RegisterComponent} from './register.component';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Observable, of, throwError} from "rxjs";
import {RegisterRequest} from "../../interfaces/registerRequest.interface";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        {provide: AuthService, useValue: {register: jest.fn()}},
        {provide: Router, useValue: {navigate: jest.fn()}},
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form, handle success, and navigate registration', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };
    const authServiceSpy = jest
      .spyOn(authService, 'register').mockReturnValue(of(void Observable));
    const routerSpy = jest.spyOn(router, 'navigate');

    component.form.setValue(registerRequest);
    component.submit();

    expect(authServiceSpy).toHaveBeenCalledWith(registerRequest);
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true on registration error', () => {
    jest.spyOn(authService, 'register')
      .mockReturnValue(throwError(() => new Error('Registration error')));

    component.submit();

    expect(component.onError).toBe(true);
  });

  // Register (L’affichage d’erreur en l’absence d’un champ obligatoire) ❌
  it('should display a error message on', () => {
  });
});
