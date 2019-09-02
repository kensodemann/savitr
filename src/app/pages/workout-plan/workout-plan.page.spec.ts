import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { UrlSerializer } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { parseISO } from 'date-fns';

import { WorkoutPlanPage } from './workout-plan.page';
import { DateService } from '@app/services';
import { createDateServiceMock } from '@app/services/mocks';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { createWeeklyWorkoutLogsServiceMock } from '@app/services/firestore-data/mocks';

describe('WorkoutPlanPage', () => {
  let component: WorkoutPlanPage;
  let fixture: ComponentFixture<WorkoutPlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkoutPlanPage],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: DateService, useFactory: createDateServiceMock },
        { provide: Location, useValue: {} },
        { provide: UrlSerializer, useValue: {} },
        {
          provide: WeeklyWorkoutLogsService,
          useFactory: createWeeklyWorkoutLogsServiceMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    const dates = TestBed.get(DateService);
    dates.beginDates.and.returnValue([
      parseISO('2019-07-07'),
      parseISO('2019-07-14'),
      parseISO('2019-07-21'),
      parseISO('2019-07-28'),
      parseISO('2019-08-04')
    ]);
    fixture = TestBed.createComponent(WorkoutPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets the next set of possible begin dates', () => {
    expect(component.beginDates).toEqual([
      parseISO('2019-07-07'),
      parseISO('2019-07-14'),
      parseISO('2019-07-21'),
      parseISO('2019-07-28'),
      parseISO('2019-08-04')
    ]);
  });

  describe('on begin date changed', () => {
    it('gets the workout log for that begin date', () => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      component.beginDate = new Date();
      component.beginDateChanged();
      expect(workoutLogs.getForDate).toHaveBeenCalledTimes(1);
      expect(workoutLogs.getForDate).toHaveBeenCalledWith(component.beginDate);
    });
  });
});
