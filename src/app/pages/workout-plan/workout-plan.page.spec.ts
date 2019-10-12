import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { UrlSerializer, ActivatedRoute } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { parseISO, getTime } from 'date-fns';

import { WorkoutPlanPage } from './workout-plan.page';
import { DateService } from '@app/services';
import { createDateServiceMock } from '@app/services/mocks';
import { WeeklyWorkoutLogsService, WorkoutLogEntriesService } from '@app/services/firestore-data';
import {
  createWeeklyWorkoutLogsServiceMock,
  createWorkoutLogEntriesServiceMock
} from '@app/services/firestore-data/mocks';
import { createActivatedRouteMock, createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { LogEntryEditorComponent } from '@app/editors';
import { WorkoutLogEntry } from '@app/models';

describe('WorkoutPlanPage', () => {
  let alert;
  let logEntries: Array<WorkoutLogEntry>;
  let component: WorkoutPlanPage;
  let fixture: ComponentFixture<WorkoutPlanPage>;
  let modal;

  beforeEach(async(() => {
    alert = createOverlayElementMock('Alert');
    modal = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      declarations: [WorkoutPlanPage],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
        { provide: AlertController, useFactory: () => createOverlayControllerMock('AlertController', alert) },
        { provide: DateService, useFactory: createDateServiceMock },
        { provide: Location, useValue: {} },
        { provide: ModalController, useFactory: () => createOverlayControllerMock('ModalController', modal) },
        { provide: UrlSerializer, useValue: {} },
        { provide: WeeklyWorkoutLogsService, useFactory: createWeeklyWorkoutLogsServiceMock },
        { provide: WorkoutLogEntriesService, useFactory: createWorkoutLogEntriesServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    initializeTestData();
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
      route.snapshot.paramMap.get.and.returnValue('314159PI');
      getPromise = Promise.resolve({
        id: '314159PI',
        beginDate: parseISO('2019-05-14')
      });
      workoutLogs.get.withArgs('314159PI').and.returnValue(getPromise);
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
      workoutLogs.getForDate.and.returnValue({
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

    it('gets the exercises for the log', async () => {
      const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
      await component.beginDateChanged();
      expect(workoutLogEntries.getAllForLog).toHaveBeenCalledTimes(1);
      expect(workoutLogEntries.getAllForLog).toHaveBeenCalledWith('12399goasdf9');
    });

    it('processes the exercise logs', async () => {
      const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
      workoutLogEntries.getAllForLog.and.returnValue(Promise.resolve(logEntries));
      await component.beginDateChanged();
      expect(component.exerciseLogs.length).toEqual(7);
      expect(component.exerciseLogs[0].length).toEqual(1);
      expect(component.exerciseLogs[1].length).toEqual(3);
      expect(component.exerciseLogs[2].length).toEqual(0);
      expect(component.exerciseLogs[3].length).toEqual(1);
      expect(component.exerciseLogs[4].length).toEqual(2);
      expect(component.exerciseLogs[5].length).toEqual(0);
      expect(component.exerciseLogs[6].length).toEqual(0);
    });
  });

  describe('adding an exercise', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('without a chosen date', () => {
      it('presents an alert', async () => {
        const alertController = TestBed.get(AlertController);
        await component.addExercise(1);
        expect(alertController.create).toHaveBeenCalledTimes(1);
        expect(alert.present).toHaveBeenCalledTimes(1);
      });

      it('does not open a modal', async () => {
        const modalController = TestBed.get(ModalController);
        await component.addExercise(1);
        expect(modalController.create).not.toHaveBeenCalled();
      });
    });

    describe('with a chosen date', () => {
      beforeEach(async () => {
        const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
        const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
        workoutLogs.getForDate.and.returnValue(
          Promise.resolve({ id: '199g009d8a', beginDate: parseISO('2019-07-21') })
        );
        workoutLogEntries.getAllForLog.and.returnValue(Promise.resolve(logEntries));
        component.beginMS = parseISO('2019-07-21').getTime();
        await component.beginDateChanged();
        modal.onDidDismiss.and.returnValue({});
      });

      it('opens a modal', () => {
        const modalController = TestBed.get(ModalController);
        component.addExercise(1);
        expect(modalController.create).toHaveBeenCalledTimes(1);
      });

      it('passes the proper date and component', () => {
        const modalController = TestBed.get(ModalController);
        component.addExercise(1);
        expect(modalController.create).toHaveBeenCalledWith({
          component: LogEntryEditorComponent,
          componentProps: {
            logDate: parseISO('2019-07-22'),
            workoutLog: { id: '199g009d8a', beginDate: parseISO('2019-07-21') }
          }
        });
      });

      it('presents the editor modal', async () => {
        await component.addExercise(1);
        expect(modal.present).toHaveBeenCalledTimes(1);
      });

      describe('when the user saves the item', () => {
        beforeEach(() => {
          modal.onDidDismiss.and.returnValue({
            data: {
              workoutLog: { id: '199g009d8a', beginDate: parseISO('2019-07-21') },
              logDate: parseISO('2019-07-22'),
              exercise: {
                id: '773758FC3',
                name: 'Dumbbell Bench Press',
                description: 'Bench press using two dumbbells',
                area: 'Upper Body',
                type: 'Free Weight'
              },
              time: '1:45'
            },
            role: 'save'
          });
        });

        it('adds the workout log entry', async () => {
          const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
          await component.addExercise(1);
          expect(workoutLogEntries.add).toHaveBeenCalledTimes(1);
          expect(workoutLogEntries.add).toHaveBeenCalledWith({
            workoutLog: { id: '199g009d8a', beginDate: parseISO('2019-07-21') },
            logDate: parseISO('2019-07-22'),
            exercise: {
              id: '773758FC3',
              name: 'Dumbbell Bench Press',
              description: 'Bench press using two dumbbells',
              area: 'Upper Body',
              type: 'Free Weight'
            },
            time: '1:45'
          });
        });

        it('requeries the database', async () => {
          const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
          workoutLogEntries.getAllForLog.calls.reset();
          await component.addExercise(1);
          expect(workoutLogEntries.getAllForLog).toHaveBeenCalledTimes(1);
          expect(workoutLogEntries.getAllForLog).toHaveBeenCalledWith('199g009d8a');
        });
      });

      describe('when the user cancels the item', () => {
        it('does nothing', async () => {
          const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
          await component.addExercise(1);
          expect(workoutLogEntries.add).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('deleting a workout log entry', () => {
    beforeEach(() => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get.and.returnValue('12399goasdf9');
      workoutLogs.get.and.returnValue({
        id: '12399goasdf9',
        beginDate: parseISO('2019-07-21')
      });
      fixture.detectChanges();
      alert.onDidDismiss.and.returnValue(Promise.resolve({ role: 'backdrop' }));
    });

    it('asks the user if they are sure', async () => {
      const alertController = TestBed.get(AlertController);
      await component.delete(logEntries[1]);
      expect(alertController.create).toHaveBeenCalledTimes(1);
      expect(alertController.create).toHaveBeenCalledWith({
        header: 'Remove Entry?',
        message: 'Are you sure you would like to remove this exercise from the workout log?',
        buttons: [{ text: 'Yes', role: 'confirm' }, { text: 'No', role: 'cancel' }]
      });
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    describe('when the user says yes', () => {
      beforeEach(() => {
        alert.onDidDismiss.and.returnValue(Promise.resolve({ role: 'confirm' }));
      });

      it('deletes the log entry', async () => {
        const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
        await component.delete(logEntries[1]);
        expect(workoutLogEntries.delete).toHaveBeenCalledTimes(1);
        expect(workoutLogEntries.delete).toHaveBeenCalledWith(logEntries[1]);
      });

      it('refreshes the workout log', async () => {
        const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
        await component.delete(logEntries[1]);
        expect(workoutLogEntries.getAllForLog).toHaveBeenCalledTimes(1);
        expect(workoutLogEntries.getAllForLog).toHaveBeenCalledWith('12399goasdf9');
      });
    });

    describe('when the user says no', () => {
      beforeEach(() => {
        alert.onDidDismiss.and.returnValue(Promise.resolve({ role: 'cancel' }));
      });

      it('does not delete the log entry', async () => {
        const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
        await component.delete(logEntries[1]);
        expect(workoutLogEntries.delete).not.toHaveBeenCalled();
      });

      it('does not refresh the workout log', async () => {
        const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
        await component.delete(logEntries[1]);
        expect(workoutLogEntries.getAllForLog).not.toHaveBeenCalled();
      });
    });
  });

  describe('editing a workout log entry', () => {
    beforeEach(() => {
      const workoutLogs = TestBed.get(WeeklyWorkoutLogsService);
      const route = TestBed.get(ActivatedRoute);
      route.snapshot.paramMap.get.and.returnValue('12399goasdf9');
      workoutLogs.get.and.returnValue({
        id: '12399goasdf9',
        beginDate: parseISO('2019-07-21')
      });
      fixture.detectChanges();
    });

    it('opens a modal', () => {
      const modalController = TestBed.get(ModalController);
      component.edit(logEntries[2]);
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('passes the log entry to the editor component', () => {
      const modalController = TestBed.get(ModalController);
      component.edit(logEntries[2]);
      expect(modalController.create).toHaveBeenCalledWith({
        component: LogEntryEditorComponent,
        componentProps: {
          workoutLogEntry: logEntries[2] 
        }
      });
    });

    it('presents the editor modal', async () => {
      await component.edit(logEntries[2]);
      expect(modal.present).toHaveBeenCalledTimes(1);
    });

    describe('when the user saves the edit', () => {
      beforeEach(() => {
        modal.onDidDismiss.and.returnValue({
          data: {
            workoutLog: { id: '199g009d8a', beginDate: parseISO('2019-07-21') },
            logDate: parseISO('2019-07-22'),
            exercise: {
              id: '773758FC3',
              name: 'Dumbbell Bench Press',
              description: 'Bench press using two dumbbells',
              area: 'Upper Body',
              type: 'Free Weight'
            },
            time: '1:45'
          },
          role: 'save'
        });
      });

      it('updates the workout log entry', async () => {
        const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
        await component.edit(logEntries[2]);
        expect(workoutLogEntries.update).toHaveBeenCalledTimes(1);
        expect(workoutLogEntries.update).toHaveBeenCalledWith({
          workoutLog: { id: '199g009d8a', beginDate: parseISO('2019-07-21') },
          logDate: parseISO('2019-07-22'),
          exercise: {
            id: '773758FC3',
            name: 'Dumbbell Bench Press',
            description: 'Bench press using two dumbbells',
            area: 'Upper Body',
            type: 'Free Weight'
          },
          time: '1:45'
        });
      });

      it('requeries the database', async () => {
        const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
        workoutLogEntries.getAllForLog.calls.reset();
        await component.edit(logEntries[2]);
        expect(workoutLogEntries.getAllForLog).toHaveBeenCalledTimes(1);
        expect(workoutLogEntries.getAllForLog).toHaveBeenCalledWith('12399goasdf9');
      });
    });

    describe('when the user cancels the edit', () => {
      it('does nothing', async () => {
        const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
        await component.edit(logEntries[2]);
        expect(workoutLogEntries.update).not.toHaveBeenCalled();
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
