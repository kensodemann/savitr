import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { UrlSerializer, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { parseISO } from 'date-fns';

import { WorkoutPlanPage } from './workout-plan.page';
import { DateService } from '@app/services';
import { createDateServiceMock } from '@app/services/mocks';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { createWeeklyWorkoutLogsServiceMock } from '@app/services/firestore-data/mocks';
import { createActivatedRouteMock } from '@test/mocks';

describe('WorkoutPlanPage', () => {
  let component: WorkoutPlanPage;
  let fixture: ComponentFixture<WorkoutPlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkoutPlanPage],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets the next set of possible begin dates', () => {
    fixture.detectChanges();
    expect(component.beginDates).toEqual([
      parseISO('2019-07-07'),
      parseISO('2019-07-14'),
      parseISO('2019-07-21'),
      parseISO('2019-07-28'),
      parseISO('2019-08-04')
    ]);
  });

  it('gets the ID from the route', () => {
    const route = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
    expect(route.snapshot.paramMap.get).toHaveBeenCalledTimes(1);
    expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('id');
  });

  describe('if there is not an ID in the route', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('does not get a log', () => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      expect(workoutLogs.get).not.toHaveBeenCalled();
    });

    it('does not disable the date', () => {
      expect(component.disableDateChange).toBeFalsy();
    });
  });

  describe('if there is an ID in the route', () => {
    let getPromise;
    beforeEach(() => {
      const route = TestBed.get(ActivatedRoute);
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      route.snapshot.paramMap.get.and.returnValue('314159PI');
      getPromise = Promise.resolve({
        id: '314159PI',
        beginDate: new Date('2019-05-14T00:00:00.00000')
      });
      workoutLogs.get.withArgs('314159PI').and.returnValue(getPromise);
      fixture.detectChanges();
    });

    it('get the log for the id', () => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      expect(workoutLogs.get).toHaveBeenCalledTimes(1);
      expect(workoutLogs.get).toHaveBeenCalledWith('314159PI');
    });

    it('sets the begin date to the that of the log', async () => {
      await getPromise;
      expect(component.beginMS).toEqual((new Date('2019-05-14T00:00:00.00000')).getTime());
    });

    it('does not allow the date to be changed', async () => {
      await getPromise;
      expect(component.disableDateChange).toEqual(true);
    });
  });

  describe('on begin date changed', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('gets the workout log for that begin date', () => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      const date = new Date();
      component.beginMS = date.getTime();
      component.beginDateChanged();
      expect(workoutLogs.getForDate).toHaveBeenCalledTimes(1);
      expect(workoutLogs.getForDate).toHaveBeenCalledWith(date);
    });
  });
});
