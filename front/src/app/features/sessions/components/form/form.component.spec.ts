import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';
import {SessionApiService} from '../../services/session-api.service';

import {FormComponent} from './form.component';
import {ActivatedRoute, Router} from "@angular/router";
import {Session} from "../../interfaces/session.interface";
import {of} from "rxjs";
import {ListComponent} from "../list/list.component";
import {By} from "@angular/platform-browser";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockActivatedRoute: ActivatedRoute;
  let mockRouter: Router;
  let snackBar: MatSnackBar;
  let sessionApiService: SessionApiService;

  const sessionServiceMock = {
    sessionInformation: {
      admin: true
    }
  }

  const sessionMock: Session = {
    name: 'Test',
    description: 'Description Test',
    date: new Date(),
    teacher_id: 2,
    users: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'sessions', component: ListComponent},
        ]),
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: SessionService, useValue: sessionServiceMock},
        SessionApiService,
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    mockActivatedRoute = TestBed.inject(ActivatedRoute);
    mockRouter = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    sessionApiService = TestBed.inject(SessionApiService);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    let routerSpy: jest.SpyInstance;
    let sessionApiServiceSpy: jest.SpyInstance;

    beforeEach(() => {
      routerSpy = jest.spyOn(mockRouter, 'navigate');
      sessionApiServiceSpy = jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(sessionMock));
    })

    it('should not navigate away if user is admin', () => {

      component.ngOnInit();

      expect(routerSpy).not.toHaveBeenCalled();
    });

    it('should navigate away if user is not admin', () => {
      sessionServiceMock.sessionInformation.admin = false;

      component.ngOnInit();

      expect(routerSpy).toHaveBeenCalledWith(['/sessions']);
    });

    it('should set update state and call detail on activated route param', () => {
      jest.spyOn(mockActivatedRoute.snapshot.paramMap, 'get').mockReturnValue('1');
      jest.spyOn(mockRouter, 'url', 'get').mockReturnValue('/update/1');

      component.ngOnInit();

      expect(component.onUpdate).toBeTruthy();
      expect(sessionApiServiceSpy).toHaveBeenCalledWith('1');
    });

    it('should not set update state and not call detail on empty route param', () => {
      jest.spyOn(mockRouter, 'url', 'get').mockReturnValue('');

      component.ngOnInit();

      expect(component.onUpdate).toBeFalsy();
      expect(sessionApiServiceSpy).not.toHaveBeenCalled();
    });

    it('should create session form', async () => {

      component.ngOnInit();

      expect(component.sessionForm).toBeTruthy();
    })
  });

  describe('Submit', () => {
    let routerSpy: jest.SpyInstance;
    let snackBarSpy: jest.SpyInstance;
    let mockSession: {}

    beforeEach(() => {
      mockSession = {name: 'Test', description: 'Description Test', date: new Date(), teacher_id: 2};
      routerSpy = jest.spyOn(mockRouter, 'navigate').mockImplementation();
      snackBarSpy = jest.spyOn(snackBar, 'open');
    });

    it('should call create API on submit for new session', () => {
      const mockSessionApiService = jest
        .spyOn(sessionApiService, 'create').mockReturnValue(of(sessionMock));
      component.sessionForm?.setValue(mockSession);
      component.onUpdate = false;

      component.submit();

      expect(mockSessionApiService).toHaveBeenCalledWith(mockSession);
      expect(snackBarSpy).toHaveBeenCalledWith('Session created !', 'Close', {duration: 3000});
      expect(routerSpy).toHaveBeenCalledWith(['sessions']);
    });

    it('should update session and navigate to sessions', () => {
      const mockSessionApiService = jest
        .spyOn(sessionApiService, 'update').mockReturnValue(of(sessionMock));
      component.onUpdate = true;

      component.submit();

      expect(mockSessionApiService).toHaveBeenCalled();
      expect(snackBarSpy).toHaveBeenCalledWith('Session updated !', 'Close', {duration: 3000});
      expect(routerSpy).toHaveBeenCalledWith(['sessions']);
    });
  });
});
