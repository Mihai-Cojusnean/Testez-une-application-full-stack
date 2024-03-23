import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';

import {ListComponent} from './list.component';
import {of} from "rxjs";
import {SessionApiService} from "../../services/session-api.service";
import {Session} from "../../interfaces/session.interface";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {By} from "@angular/platform-browser";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";
import {DebugElement} from "@angular/core";

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  let sessionApiService: any;

  const sessionInformation: SessionInformation = {
    token: "",
    type: "",
    id: 1,
    username: "",
    firstName: "",
    lastName: "",
    admin: true
  };

  const sessionsMock: Session[] = [{
    name: 'Session 1',
    description: 'Session description 1',
    date: new Date(),
    teacher_id: 2,
    users: [1, 2, 3],
    createdAt: new Date(),
    updatedAt: new Date()
  }];

  beforeEach(async () => {

    sessionApiService = {
      all: jest.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientTestingModule, MatCardModule, MatIconModule],
      providers: [
        {provide: SessionApiService, useValue: sessionApiService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    sessionService = TestBed.inject(SessionService);
    sessionService.sessionInformation = sessionInformation;
    sessionApiService = TestBed.inject(SessionApiService);

    component = fixture.componentInstance;
    component.sessions$ = of(sessionsMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set sessions$ correctly', () => {
    fixture.detectChanges();

    expect(sessionApiService.all).toHaveBeenCalled();
    expect(sessionApiService.all).toHaveBeenCalledTimes(1);
  });

  it('should get user information from sessionService', () => {
    const user = component.user;

    fixture.detectChanges();

    expect(user).toEqual(sessionInformation);
  });

  describe('Displayed buttons', () => {
    /* buttons
    if ADMIN:
       1. create
       2. detail
       3. edit
    if USER:
       only - detail
    */

    it('should display Create and Edit buttons for admin user', () => {
      const createButton: DebugElement = fixture.debugElement.queryAll(By.css('.ml1'))[0];
      expect(createButton).toBeTruthy();
      expect(createButton.nativeElement.textContent).toBe('Create');

      const editButton: DebugElement = fixture.debugElement.queryAll(By.css('.ml1'))[2];
      expect(editButton).toBeTruthy();
      expect(editButton.nativeElement.textContent).toBe('Edit');
    });

    it('should not display Create and Edit buttons for non-admin user', () => {
      sessionService.sessionInformation = {
        token: "",
        type: "",
        id: 1,
        username: "",
        firstName: "",
        lastName: "",
        admin: false
      }

      fixture.detectChanges();

      const createButton: DebugElement = fixture.debugElement.queryAll(By.css('.ml1'))[0];
      expect(createButton).toBeTruthy();
      expect(createButton.nativeElement.textContent).toBe('Detail');

      const editButton: DebugElement = fixture.debugElement.queryAll(By.css('.ml1'))[1];
      expect(editButton).toBeFalsy();
    });
  });
});
