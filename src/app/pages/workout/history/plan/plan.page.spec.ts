import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { UrlSerializer, ActivatedRoute } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { parseISO } from 'date-fns';

import { PlanPage } from './plan.page';
import { DateService } from '@app/services';
import { createDateServiceMock } from '@app/services/mocks';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { createWeeklyWorkoutLogsServiceMock } from '@app/services/firestore-data/mocks';
import { createActivatedRouteMock, createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { WorkoutLogEntry } from '@app/models';
import { WorkoutPageService } from '@app/pages/workout/services/workout-page/workout-page.service';
import { createWorkoutPageServiceMock } from '@app/pages/workout/services/workout-page/workout-page.service.mock';

describe('PlanPage', () => {
  let alert;
  let logEntries: Array<WorkoutLogEntry>;
  let component: PlanPage;
  let fixture: ComponentFixture<PlanPage>;
  let modal;

  beforeEach(async(() => {
    alert = createOverlayElementMock();
    modal = createOverlayElementMock();
    TestBed.configureTestingModule({
      declarations: [PlanPage],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
        { provide: AlertController, useFactory: () => createOverlayControllerMock(alert) },
        { provide: DateService, useFactory: createDateServiceMock },
        { provide: Location, useValue: {} },
        { provide: UrlSerializer, useValue: {} },
        { provide: WeeklyWorkoutLogsService, useFactory: createWeeklyWorkoutLogsServiceMock },
        { provide: WorkoutPageService, useFactory: createWorkoutPageServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    initializeTestData();
    const dates = TestBed.get(DateService);
    dates.beginDates.mockReturnValue([
      parseISO('2019-07-07'),
      parseISO('2019-07-14'),
      parseISO('2019-07-21'),
      parseISO('2019-07-28'),
      parseISO('2019-08-04')
    ]);
    fixture = TestBed.createComponent(PlanPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    it('sets the next set of possible begin dates', () => {
      expect(component.beginDates).toEqual([
        parseISO('2019-07-07'),
        parseISO('2019-07-14'),
        parseISO('2019-07-21'),
        parseISO('2019-07-28'),
        parseISO('2019-08-04')
      ]);
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
      route.snapshot.paramMap.get.mockReturnValue('314159PI');
      getPromise = Promise.resolve({
        id: '314159PI',
        beginDate: parseISO('2019-05-14')
      });
      workoutLogs.get.mockReturnValue(getPromise);
      fixture.detectChanges();
    });

    it('get the log for the id', () => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      expect(workoutLogs.get).toHaveBeenCalledTimes(1);
      expect(workoutLogs.get).toHaveBeenCalledWith('314159PI');
    });

    it('fixes the set of possible begin dates to the beginDate for the log', async () => {
      await getPromise;
      expect(component.beginDates).toEqual([parseISO('2019-05-14')]);
    });

    it('sets the begin date to the that of the log', async () => {
      await getPromise;
      expect(component.beginMS).toEqual(new Date('2019-05-14T00:00:00.00000').getTime());
    });

    it('does not allow the date to be changed', async () => {
      await getPromise;
      expect(component.disableDateChange).toEqual(true);
    });
  });

  describe('on begin date changed', () => {
    beforeEach(() => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      workoutLogs.getForDate.mockResolvedValue({
        id: '12399goasdf9',
        beginDate: parseISO('2019-07-21')
      });
      fixture.detectChanges();
    });

    it('gets the workout log for that begin date', () => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      const date = parseISO('2019-07-21');
      component.beginMS = date.getTime();
      component.beginDateChanged();
      expect(workoutLogs.getForDate).toHaveBeenCalledTimes(1);
      expect(workoutLogs.getForDate).toHaveBeenCalledWith(date);
    });

    it('gets the entries for the log', async () => {
      const workoutPageService = TestBed.get(WorkoutPageService);
      await component.beginDateChanged();
      expect(workoutPageService.logEntries).toHaveBeenCalledTimes(1);
      expect(workoutPageService.logEntries).toHaveBeenCalledWith({
        id: '12399goasdf9',
        beginDate: parseISO('2019-07-21')
      });
    });
  });

  describe('adding an exercise', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('without a chosen date', () => {
      it('presents an alert', async () => {
        const alertController = TestBed.get(AlertController);
        await component.add(1);
        expect(alertController.create).toHaveBeenCalledTimes(1);
        expect(alert.present).toHaveBeenCalledTimes(1);
      });

      it('does not perform the add action', async () => {
        const workoutPageService = TestBed.get(WorkoutPageService);
        await component.add(1);
        expect(workoutPageService.add).not.toHaveBeenCalled();
      });
    });

    describe('with a chosen date', () => {
      beforeEach(async () => {
        const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
        workoutLogs.getForDate.mockResolvedValue({ id: '199g009d8a', beginDate: parseISO('2019-07-21') });
        component.beginMS = parseISO('2019-07-21').getTime();
        await component.beginDateChanged();
        modal.onDidDismiss.mockResolvedValue({});
      });

      it('performs the add action', async () => {
        const workoutPageService = TestBed.get(WorkoutPageService);
        await component.add(1);
        expect(workoutPageService.add).toHaveBeenCalledTimes(1);
        expect(workoutPageService.add).toHaveBeenCalledWith(
          {
            id: '199g009d8a',
            beginDate: parseISO('2019-07-21')
          },
          parseISO('2019-07-22')
        );
      });

      describe('when the user completes the add action', () => {
        beforeEach(() => {
          const workoutPageService = TestBed.get(WorkoutPageService);
          workoutPageService.add.mockResolvedValue(true);
        });

        it('gets a fresh set of log entries', async () => {
          const workoutPageService = TestBed.get(WorkoutPageService);
          workoutPageService.logEntries.mockClear();
          await component.add(1);
          expect(workoutPageService.logEntries).toHaveBeenCalledTimes(1);
          expect(workoutPageService.logEntries).toHaveBeenCalledWith({
            id: '199g009d8a',
            beginDate: parseISO('2019-07-21')
          });
        });
      });

      describe('when the user cancels the add action', () => {
        it('does nothing', async () => {
          const workoutPageService = TestBed.get(WorkoutPageService);
          workoutPageService.logEntries.mockClear();
          await component.add(1);
          expect(workoutPageService.logEntries).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('deleting a workout log entry', () => {
    beforeEach(() => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get.mockReturnValue('12399goasdf9');
      workoutLogs.get.mockResolvedValue({
        id: '12399goasdf9',
        beginDate: parseISO('2019-07-21')
      });
      fixture.detectChanges();
    });

    it('performs the delete action', async () => {
      const workoutPageService = TestBed.get(WorkoutPageService);
      await component.delete(logEntries[1]);
      expect(workoutPageService.delete).toHaveBeenCalledTimes(1);
      expect(workoutPageService.delete).toHaveBeenCalledWith(logEntries[1]);
    });

    describe('when the user completes the delete action', () => {
      beforeEach(() => {
        const workoutPageService = TestBed.get(WorkoutPageService);
        workoutPageService.delete.mockResolvedValue(true);
      });

      it('refreshes the log entries', async () => {
        const workoutPageService = TestBed.get(WorkoutPageService);
        await component.delete(logEntries[1]);
        expect(workoutPageService.logEntries).toHaveBeenCalledTimes(1);
        expect(workoutPageService.logEntries).toHaveBeenCalledWith({
          id: '12399goasdf9',
          beginDate: parseISO('2019-07-21')
        });
      });
    });

    describe('when the user cancels the delete action', () => {
      it('does not refresh the log entries', async () => {
        const workoutPageService = TestBed.get(WorkoutPageService);
        await component.delete(logEntries[1]);
        expect(workoutPageService.logEntries).not.toHaveBeenCalled();
      });
    });
  });

  describe('editing a workout log entry', () => {
    beforeEach(() => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get.mockReturnValue('12399goasdf9');
      workoutLogs.get.mockResolvedValue({
        id: '12399goasdf9',
        beginDate: parseISO('2019-07-21')
      });
      fixture.detectChanges();
    });

    it('performs the edit action', async () => {
      const workoutPageService = TestBed.get(WorkoutPageService);
      await component.edit(logEntries[2]);
      expect(workoutPageService.edit).toHaveBeenCalledTimes(1);
      expect(workoutPageService.edit).toHaveBeenCalledWith(logEntries[2]);
    });

    describe('when the user completes the edit action', () => {
      beforeEach(() => {
        const workoutPageService = TestBed.get(WorkoutPageService);
        workoutPageService.edit.mockResolvedValue(true);
      });

      it('refreshes the log entries', async () => {
        const workoutPageService = TestBed.get(WorkoutPageService);
        await component.edit(logEntries[2]);
        expect(workoutPageService.logEntries).toHaveBeenCalledTimes(1);
        expect(workoutPageService.logEntries).toHaveBeenCalledWith({
          id: '12399goasdf9',
          beginDate: parseISO('2019-07-21')
        });
      });
    });

    describe('when the user cancels the edit action', () => {
      it('does not refresh the log entries', async () => {
        const workoutPageService = TestBed.get(WorkoutPageService);
        await component.edit(logEntries[2]);
        expect(workoutPageService.logEntries).not.toHaveBeenCalled();
      });
    });
  });

  function initializeTestData() {
    logEntries = [
      {
        id: 'fkkgiire0953',
        logDate: parseISO('2019-07-22'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21')
        },
        exercise: {
          id: '1149953',
          name: 'Curls',
          description: 'Basic Biscept Curls',
          type: 'Free Weight',
          area: 'Upper Body'
        },
        completed: false
      },
      {
        id: 'fkkgiffoeid',
        logDate: parseISO('2019-07-21'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21')
        },
        exercise: {
          id: 'jadfoibdk',
          name: 'Jog',
          description: 'Uhg',
          type: 'Body Weight',
          area: 'Cardio'
        },
        completed: false
      },
      {
        id: 'kfkafoig9f0ed',
        logDate: parseISO('2019-07-22'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21')
        },
        exercise: {
          id: 'fkfvibdj',
          name: 'Exercise Bike',
          description: 'Basic Biking',
          type: 'Machine',
          area: 'Cardio'
        },
        completed: false
      },
      {
        id: 'fkfig09ekfek',
        logDate: parseISO('2019-07-24'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21')
        },
        exercise: {
          id: 'kfkfigfid',
          name: 'Leg Curls',
          description: 'Basic Leg Curls',
          type: 'Machine',
          area: 'Lower Body'
        },
        completed: false
      },
      {
        id: 'ifiifiigifi',
        logDate: parseISO('2019-07-22'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21')
        },
        exercise: {
          id: 'iifgiifdie',
          name: 'Bench Press',
          description: 'Basic Press',
          type: 'Free Weight',
          area: 'Upper Body'
        },
        completed: false
      },
      {
        id: 'firemyass',
        logDate: parseISO('2019-07-25'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21')
        },
        exercise: {
          id: 'jadfoibdk',
          name: 'Jog',
          description: 'Uhg',
          type: 'Body Weight',
          area: 'Cardio'
        },
        completed: false
      },
      {
        id: 'fiifigofdive',
        logDate: parseISO('2019-07-25'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21')
        },
        exercise: {
          id: '1149953',
          name: 'Curls',
          description: 'Basic Biscept Curls',
          type: 'Free Weight',
          area: 'Upper Body'
        },
        completed: false
      }
    ];
  }
});
