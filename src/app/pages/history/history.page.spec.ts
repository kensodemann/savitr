import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

import { HistoryPage } from './history.page';
import { AuthenticationService } from '@app/services';
import { createAuthenticationServiceMock } from '@app/services/mocks';
import { createNavControllerMock, createAngularFireAuthMock } from 'test/mocks';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { createWeeklyWorkoutLogsServiceMock } from '@app/services/firestore-data/mocks';

describe('HistoryPage', () => {
  let component: HistoryPage;
  let fixture: ComponentFixture<HistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        {
          provide: AuthenticationService,
          useFactory: createAuthenticationServiceMock
        },
        { provide: NavController, useFactory: createNavControllerMock },
        {
          provide: WeeklyWorkoutLogsService,
          useFactory: createWeeklyWorkoutLogsServiceMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('gets the work logs', () => {
    const afAuth = TestBed.get(AngularFireAuth);
    afAuth.authState.next({ id: '1234325' });
    const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
    expect(workoutLogs.all).toHaveBeenCalledTimes(1);
  });

  describe('add', () => {
    it('navigates to the workout-plan page', () => {
      const navController = TestBed.get(NavController);
      component.add();
      expect(navController.navigateForward).toHaveBeenCalledTimes(1);
      expect(navController.navigateForward).toHaveBeenCalledWith(['workout-plan']);
    });
  });
});
