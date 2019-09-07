import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { UrlSerializer, ActivatedRoute } from '@angular/router';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { parseISO } from 'date-fns';

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

describe('WorkoutPlanPage', () => {
  let alert;
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
        workoutLogs.getForDate.and.returnValue(
          Promise.resolve({ id: '199g009d8a', beginDate: parseISO('2019-07-21') })
        );
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
        });

        it('passes the returned data', async () => {
          const workoutLogEntries = TestBed.get(WorkoutLogEntriesService);
          await component.addExercise(1);
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
});
