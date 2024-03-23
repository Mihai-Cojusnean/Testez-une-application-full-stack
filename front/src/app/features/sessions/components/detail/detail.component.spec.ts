import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterTestingModule,} from '@angular/router/testing';
import {expect} from '@jest/globals';
import {SessionService} from '../../../../services/session.service';

import {DetailComponent} from './detail.component';
import {Router} from "@angular/router";
import {SessionApiService} from "../../services/session-api.service";
import {TeacherService} from "../../../../services/teacher.service";
import {of} from "rxjs";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";
import {Teacher} from "../../../../interfaces/teacher.interface";
import {Session} from "../../interfaces/session.interface";


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let matSnackBar: MatSnackBar;
  let router: Router;

  const sessionInformationMock: SessionInformation = {
    token: '',
    type: '',
    id: 1,
    username: '',
    firstName: '',
    lastName: '',
    admin: true,
  };

  const sessionMock: Session = {
    name: 'Test',
    description: 'Description Test',
    date: new Date(),
    teacher_id: 2,
    users: [1]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [SessionApiService,
        {provide: SessionService, useValue: {sessionInformation: sessionInformationMock}}],
    })
      .compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;

    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    let sessionApiServiceSpy: jest.SpyInstance;
    let teacherServiceSpy: jest.SpyInstance;

    beforeEach(() => {
      sessionApiServiceSpy = jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(sessionMock));
      teacherServiceSpy = jest.spyOn(teacherService, 'detail').mockReturnValue(of({} as Teacher));

    })

    it('should fetch session information on init', () => {

      component.ngOnInit();

      expect(sessionApiServiceSpy).toHaveBeenCalledWith(component.sessionId);
      expect(component.session).toEqual(sessionMock);
      expect(component.isParticipate).toBeTruthy();
      expect(teacherServiceSpy).toHaveBeenCalledWith(sessionMock.teacher_id.toString());
    });

    it('should display delete button for admin', () => {

      component.ngOnInit();
      fixture.detectChanges();

      const deleteButton = fixture
        .debugElement.nativeElement.querySelector('.ml1')
        .closest('button[mat-raised-button][color="warn"]');
      expect(deleteButton).toBeTruthy();
    });
  })

  it('should delete session and navigate to sessions', () => {
    const matSnackBarSpy = jest.spyOn(matSnackBar, 'open').mockImplementation();
    const sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'delete')
      .mockReturnValue(of({} as any))
    const routerSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation();

    component.delete();

    expect(sessionApiServiceSpy).toHaveBeenCalledWith(component.sessionId);
    expect(matSnackBarSpy).toHaveBeenCalledWith('Session deleted !', 'Close', {duration: 3000});
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  });

  describe('Participation', () => {
    let detailSpy: jest.SpyInstance;
    let teacherServiceSpy: jest.SpyInstance;
    let mockTeacher: Teacher;

    beforeEach(() => {
      mockTeacher = {id: 2, lastName: 'Doe', firstName: 'John', createdAt: new Date(), updatedAt: new Date(),};
      teacherServiceSpy = jest.spyOn(teacherService, "detail").mockReturnValue(of(mockTeacher));
      detailSpy = jest.spyOn(sessionApiService, "detail").mockReturnValue(of(sessionMock));
    })

    it('should participate in a session successfully', () => {
      const participateSpy = jest
        .spyOn(sessionApiService, "participate").mockReturnValue(of(void 0));

      sessionMock.users.push(sessionInformationMock.id);
      component.participate();

      expect(participateSpy).toHaveBeenCalledWith(component.sessionId, component.userId);
      expect(detailSpy).toHaveBeenCalledWith(component.sessionId);
      expect(component.isParticipate).toBeTruthy();
      expect(teacherServiceSpy).toHaveBeenCalledWith(mockTeacher.id.toString());
    });

    it('should unParticipate from a session successfully', async () => {
      const unParticipateSpy = jest
        .spyOn(sessionApiService, "unParticipate").mockReturnValue(of(void 0));

      component.unParticipate();

      expect(unParticipateSpy).toHaveBeenCalledWith(component.sessionId, component.userId);
      expect(detailSpy).toHaveBeenCalledWith(component.sessionId);
      expect(teacherServiceSpy).toHaveBeenCalledWith(mockTeacher.id.toString());
    });
  });
});

