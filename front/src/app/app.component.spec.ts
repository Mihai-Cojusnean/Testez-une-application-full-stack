import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatToolbarModule} from '@angular/material/toolbar';
import {expect} from '@jest/globals';

import {Router} from "@angular/router";
import {SessionService} from "./services/session.service";
import {Observable, of} from "rxjs";
import {AppComponent} from "./app.component";
import {RouterTestingModule} from "@angular/router/testing";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  const mockSessionService = {
    $isLogged(): Observable<boolean> {
      return of(true);
    },
    logOut(): void {
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        MatToolbarModule,
      ],
      providers: [{provide: SessionService, useValue: mockSessionService}],
      declarations: [AppComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should check login state', () => {
    let state!: boolean;

    component.$isLogged().subscribe((data: boolean) => (state = data));

    expect(state).toBe(true);
  });

  it('should navigate to root when logOut', () => {
    let navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

    component.logout();

    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});
