import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {SessionService} from 'src/app/services/session.service';

import {MeComponent} from './me.component';
import {SessionInformation} from "../../interfaces/sessionInformation.interface";
import {User} from "../../interfaces/user.interface";
import {UserService} from "../../services/user.service";
import {of} from "rxjs";
import {expect} from '@jest/globals';
import {Router} from "@angular/router";

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let sessionServiceMock: SessionService;
  let userServiceMock: UserService;
  let matSnackBar: MatSnackBar;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn(), // <----------------------------  ok? for "should delete user account and navigate to home page"
  }

  const userMock: User = {
    id: 1,
    email: 'john.doe@example.com',
    firstName: "Doe",
    lastName: "John",
    admin: false,
    password: "password123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [{provide: SessionService, useValue: mockSessionService}],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    sessionServiceMock = TestBed.inject(SessionService);
    userServiceMock = TestBed.inject(UserService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user information on ngOnInit', () => {
    const userServiceSpy = jest
      .spyOn(userServiceMock, 'getById')
      .mockReturnValue(of(userMock));

    component.ngOnInit();

    expect(userServiceSpy).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(userMock);
  });

  it('should navigate back', () => {
    const historySpy = jest.spyOn(history, 'back');

    component.back();

    expect(historySpy).toHaveBeenCalled();
  });

  it('should delete user account and navigate to home page', () => {
    const userServiceSpy = jest
      .spyOn(userServiceMock, 'delete')
      .mockReturnValue(of(userMock));
    const matSnackBarSpy = jest
      .spyOn(matSnackBar, 'open')
      .mockImplementation();
    const sessionServiceSpy = jest
      .spyOn(sessionServiceMock, 'logOut')
      .mockImplementation();
    const routerSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation();

    component.delete();

    expect(userServiceSpy).toHaveBeenCalledWith('1');
    expect(matSnackBarSpy).toHaveBeenCalledWith('Your account has been deleted !', 'Close', {duration: 3000});
    expect(sessionServiceSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });
});
