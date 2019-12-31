import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { HistoryPage } from './history.page';
import { createNavControllerMock } from '@test/mocks';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { createWeeklyWorkoutLogsServiceMock } from '@app/services/firestore-data/mocks';
import { logout } from '@app/store/actions/auth.actions';

describe('HistoryPage', () => {
  let component: HistoryPage;
  let fixture: ComponentFixture<HistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useFactory: createNavControllerMock },
        {
          provide: WeeklyWorkoutLogsService,
          useFactory: createWeeklyWorkoutLogsServiceMock
        },
        provideMockStore()
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
    const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
    expect(workoutLogs.all).toHaveBeenCalledTimes(1);
  });

  describe('logout', () => {
    it('dispatches the logout action', () => {
      const store = TestBed.get(Store);
      store.dispatch = jest.fn();
      component.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
  });
});
