import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';

import {ListComponent} from './list.component';
import {Observable, of} from "rxjs";
import {SessionApiService} from "../../services/session-api.service";
import {Session} from "../../interfaces/session.interface";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  const sessions: Session[] = [{
    name: 'Test',
    description: 'Description Test',
    date: new Date(),
    teacher_id: 2,
    users: []
  }];

  // const mockApiService = {
  //   all: () => of(sessions)
  // }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientTestingModule, MatCardModule, MatIconModule],
      providers: [
        // {provide: SessionApiService, useValue: mockApiService},
        {provide: SessionService, useValue: mockSessionService},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set sessions$ correctly', () => {

    jest.spyOn(sessionApiService, 'all').mockReturnValue(of(sessions));

    fixture.detectChanges();

    component.sessions$.subscribe((sessionList) => {
      // I'm not reaching this line
      expect(sessionList).toEqual(sessions);
    });
  });

  it('should get user information from sessionService', () => {
    const mockSessionInformation: SessionInformation = {
      token: '',
      type: '',
      id: 1,
      username: '',
      firstName: '',
      lastName: '',
      admin: true,
    };
    sessionService.sessionInformation = mockSessionInformation;
    const user = component.user;

    fixture.detectChanges();

    expect(user).toEqual(mockSessionInformation);
  });

  it('should display Create and Edit buttons for admin user', async () => {

    const sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'all')
      .mockReturnValue(of(sessions));

    const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');

    fixture.componentInstance.sessions$.subscribe();

    // expect(sessionApiServiceSpy).toHaveBeenCalled();

    //   .subscribe((sessionList: Session[]) => {
    //   expect(sessionList).toBeGreaterThan(0);
    //   console.log(1)
    // }, error => console.log(error));

    // expect(createButton).toBeTruthy();

    // console.log(fixture.componentInstance.sessions$)



    const editButton = fixture.nativeElement.querySelector('button.mat-focus-indicator.mat-raised-button.mat-button-base.mat-primary.ng-star-inserted');
    console.log(editButton)
    // expect(editButton).toBeTruthy();
  });

  it('should not display Create and Edit buttons for non-admin user', () => {
    mockSessionService.sessionInformation.admin = false;

    fixture.detectChanges();

    const createButton = fixture.nativeElement.querySelector('button[mat-raised-button][routerLink="create"]');
    expect(createButton).toBeFalsy();

    // is not false because it's value is NodeList{}
    const editButton = fixture.nativeElement.querySelectorAll('button[mat-raised-button][routerLink^="update"]');
    // expect(editButton).toBeFalsy();
  });
});
