import { TestBed } from '@angular/core/testing';
import { LogEntryEditorComponent } from '@app/editors';
import { WorkoutLogEntry } from '@app/models';
import { WorkoutPageService } from '@app/pages/workout/services/workout-page/workout-page.service';
import { WorkoutLogEntriesService } from '@app/services/firestore-data';
import { createWorkoutLogEntriesServiceMock } from '@app/services/firestore-data/mocks';
import { AlertController, ModalController } from '@ionic/angular';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { parseISO } from 'date-fns';

describe('PlanPage', () => {
  let alert;
  let logEntries: Array<WorkoutLogEntry>;
  let modal;

  beforeEach(() => {
    alert = createOverlayElementMock();
    modal = createOverlayElementMock();
    TestBed.configureTestingModule({
      providers: [
        { provide: AlertController, useFactory: () => createOverlayControllerMock(alert) },
        { provide: ModalController, useFactory: () => createOverlayControllerMock(modal) },
        { provide: WorkoutLogEntriesService, useFactory: createWorkoutLogEntriesServiceMock },
        WorkoutPageService,
      ],
    });
    initializeTestData();
  });

  it('should build', () => {
    const service = TestBed.inject(WorkoutPageService);
    expect(service).toBeTruthy();
  });

  describe('add', () => {
    it('opens a modal', () => {
      const service = TestBed.inject(WorkoutPageService);
      const modalController = TestBed.inject(ModalController);
      service.add({ id: '199g009d8a', beginDate: parseISO('2019-07-21') }, parseISO('2019-10-15'));
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('passes the proper date and component', () => {
      const service = TestBed.inject(WorkoutPageService);
      const modalController = TestBed.inject(ModalController);
      service.add({ id: '199g009d8a', beginDate: parseISO('2019-07-21') }, parseISO('2019-10-15'));
      expect(modalController.create).toHaveBeenCalledWith({
        component: LogEntryEditorComponent,
        componentProps: {
          logDate: parseISO('2019-10-15'),
          workoutLog: { id: '199g009d8a', beginDate: parseISO('2019-07-21') },
        },
      });
    });

    it('presents the editor modal', async () => {
      const service = TestBed.inject(WorkoutPageService);
      await service.add({ id: '199g009d8a', beginDate: parseISO('2019-07-21') }, parseISO('2019-10-15'));
      expect(modal.present).toHaveBeenCalledTimes(1);
    });

    describe('when the user saves the item', () => {
      beforeEach(() => {
        modal.onDidDismiss.mockResolvedValue({
          data: {
            workoutLog: { id: '199g009d8a', beginDate: parseISO('2019-07-21') },
            logDate: parseISO('2019-07-22'),
            exercise: {
              id: '773758FC3',
              name: 'Dumbbell Bench Press',
              description: 'Bench press using two dumbbells',
              area: 'Upper Body',
              type: 'Free Weight',
            },
            time: '1:45',
          },
          role: 'save',
        });
      });

      it('adds the workout log entry', async () => {
        const workoutLogEntries = TestBed.inject(WorkoutLogEntriesService);
        const service = TestBed.inject(WorkoutPageService);
        await service.add({ id: '199g009d8a', beginDate: parseISO('2019-07-21') }, parseISO('2019-10-15'));
        expect(workoutLogEntries.add).toHaveBeenCalledTimes(1);
        expect(workoutLogEntries.add).toHaveBeenCalledWith({
          workoutLog: { id: '199g009d8a', beginDate: parseISO('2019-07-21') },
          logDate: parseISO('2019-07-22'),
          exercise: {
            id: '773758FC3',
            name: 'Dumbbell Bench Press',
            description: 'Bench press using two dumbbells',
            area: 'Upper Body',
            type: 'Free Weight',
          },
          time: '1:45',
        });
      });

      it('resolves to true', async () => {
        const service = TestBed.inject(WorkoutPageService);
        expect(
          await service.add({ id: '199g009d8a', beginDate: parseISO('2019-07-21') }, parseISO('2019-10-15'))
        ).toEqual(true);
      });
    });

    describe('when the user cancels the item', () => {
      it('does nothing', async () => {
        const workoutLogEntries = TestBed.inject(WorkoutLogEntriesService);
        const service = TestBed.inject(WorkoutPageService);
        await service.add({ id: '199g009d8a', beginDate: parseISO('2019-07-21') }, parseISO('2019-10-15'));
        expect(workoutLogEntries.add).not.toHaveBeenCalled();
      });

      it('resolves to false', async () => {
        const service = TestBed.inject(WorkoutPageService);
        expect(
          await service.add({ id: '199g009d8a', beginDate: parseISO('2019-07-21') }, parseISO('2019-10-15'))
        ).toEqual(false);
      });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      alert.onDidDismiss.mockResolvedValue({ role: 'backdrop' });
    });

    it('asks the user if they are sure', async () => {
      const service = TestBed.inject(WorkoutPageService);
      const alertController = TestBed.inject(AlertController);
      await service.delete(logEntries[1]);
      expect(alertController.create).toHaveBeenCalledTimes(1);
      expect(alertController.create).toHaveBeenCalledWith({
        header: 'Remove Entry?',
        message: 'Are you sure you would like to remove this exercise from the workout log?',
        buttons: [
          { text: 'Yes', role: 'confirm' },
          { text: 'No', role: 'cancel' },
        ],
      });
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    describe('when the user says yes', () => {
      beforeEach(() => {
        alert.onDidDismiss.mockResolvedValue({ role: 'confirm' });
      });

      it('deletes the log entry', async () => {
        const service = TestBed.inject(WorkoutPageService);
        const workoutLogEntries = TestBed.inject(WorkoutLogEntriesService);
        await service.delete(logEntries[1]);
        expect(workoutLogEntries.delete).toHaveBeenCalledTimes(1);
        expect(workoutLogEntries.delete).toHaveBeenCalledWith(logEntries[1]);
      });

      it('resolves to true', async () => {
        const service = TestBed.inject(WorkoutPageService);
        expect(await service.delete(logEntries[1])).toEqual(true);
      });
    });

    describe('when the user says no', () => {
      beforeEach(() => {
        alert.onDidDismiss.mockResolvedValue({ role: 'cancel' });
      });

      it('does not delete the log entry', async () => {
        const service = TestBed.inject(WorkoutPageService);
        const workoutLogEntries = TestBed.inject(WorkoutLogEntriesService);
        await service.delete(logEntries[1]);
        expect(workoutLogEntries.delete).not.toHaveBeenCalled();
      });

      it('resolves to false', async () => {
        const service = TestBed.inject(WorkoutPageService);
        expect(await service.delete(logEntries[1])).toEqual(false);
      });
    });
  });

  describe('update', () => {
    it('opens a modal', () => {
      const service = TestBed.inject(WorkoutPageService);
      const modalController = TestBed.inject(ModalController);
      service.edit(logEntries[2]);
      expect(modalController.create).toHaveBeenCalledTimes(1);
    });

    it('passes the log entry to the editor component', () => {
      const service = TestBed.inject(WorkoutPageService);
      const modalController = TestBed.inject(ModalController);
      service.edit(logEntries[2]);
      expect(modalController.create).toHaveBeenCalledWith({
        component: LogEntryEditorComponent,
        componentProps: {
          workoutLogEntry: logEntries[2],
        },
      });
    });

    it('presents the editor modal', async () => {
      const service = TestBed.inject(WorkoutPageService);
      await service.edit(logEntries[2]);
      expect(modal.present).toHaveBeenCalledTimes(1);
    });

    describe('when the user saves the edit', () => {
      beforeEach(() => {
        modal.onDidDismiss.mockResolvedValue({
          data: {
            workoutLog: { id: '199g009d8a', beginDate: parseISO('2019-07-21') },
            logDate: parseISO('2019-07-22'),
            exercise: {
              id: '773758FC3',
              name: 'Dumbbell Bench Press',
              description: 'Bench press using two dumbbells',
              area: 'Upper Body',
              type: 'Free Weight',
            },
            time: '1:45',
          },
          role: 'save',
        });
      });

      it('updates the workout log entry', async () => {
        const service = TestBed.inject(WorkoutPageService);
        const workoutLogEntries = TestBed.inject(WorkoutLogEntriesService);
        await service.edit(logEntries[2]);
        expect(workoutLogEntries.update).toHaveBeenCalledTimes(1);
        expect(workoutLogEntries.update).toHaveBeenCalledWith({
          workoutLog: { id: '199g009d8a', beginDate: parseISO('2019-07-21') },
          logDate: parseISO('2019-07-22'),
          exercise: {
            id: '773758FC3',
            name: 'Dumbbell Bench Press',
            description: 'Bench press using two dumbbells',
            area: 'Upper Body',
            type: 'Free Weight',
          },
          time: '1:45',
        });
      });

      it('resolves to true', async () => {
        const service = TestBed.inject(WorkoutPageService);
        expect(await service.edit(logEntries[2])).toEqual(true);
      });
    });

    describe('when the user cancels the edit', () => {
      it('does nothing', async () => {
        const service = TestBed.inject(WorkoutPageService);
        const workoutLogEntries = TestBed.inject(WorkoutLogEntriesService);
        await service.edit(logEntries[2]);
        expect(workoutLogEntries.update).not.toHaveBeenCalled();
      });

      it('resolves to false', async () => {
        const service = TestBed.inject(WorkoutPageService);
        expect(await service.edit(logEntries[2])).toEqual(false);
      });
    });
  });

  describe('logEntries', () => {
    describe('without a workout log', () => {
      it('resolves to empty arrays', async () => {
        const service = TestBed.inject(WorkoutPageService);
        expect(await service.logEntries()).toEqual([[], [], [], [], [], [], []]);
      });
    });

    describe('with a workout log', () => {
      beforeEach(() => {
        const workoutLogEntries = TestBed.inject(WorkoutLogEntriesService);
        (workoutLogEntries.getAllForLog as any).mockResolvedValue(logEntries);
      });

      it('gets the workout log entries', () => {
        const service = TestBed.inject(WorkoutPageService);
        const workoutLogEntries = TestBed.inject(WorkoutLogEntriesService);
        service.logEntries({ id: '1003499gkkfi', beginDate: parseISO('2019-10-13') });
        expect(workoutLogEntries.getAllForLog).toHaveBeenCalledTimes(1);
        expect(workoutLogEntries.getAllForLog).toHaveBeenCalledWith('1003499gkkfi');
      });

      it('resolves to the log entries by day', async () => {
        const service = TestBed.inject(WorkoutPageService);
        const exerciseLogs = await service.logEntries({ id: '199g009d8a', beginDate: parseISO('2019-07-21') });
        expect(exerciseLogs.length).toEqual(7);
        expect(exerciseLogs[0].length).toEqual(1);
        expect(exerciseLogs[1].length).toEqual(3);
        expect(exerciseLogs[2].length).toEqual(0);
        expect(exerciseLogs[3].length).toEqual(1);
        expect(exerciseLogs[4].length).toEqual(2);
        expect(exerciseLogs[5].length).toEqual(0);
        expect(exerciseLogs[6].length).toEqual(0);
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
          beginDate: parseISO('2019-07-21'),
        },
        exercise: {
          id: '1149953',
          name: 'Curls',
          description: 'Basic Biscept Curls',
          type: 'Free Weight',
          area: 'Upper Body',
        },
        completed: false,
      },
      {
        id: 'fkkgiffoeid',
        logDate: parseISO('2019-07-21'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21'),
        },
        exercise: {
          id: 'jadfoibdk',
          name: 'Jog',
          description: 'Uhg',
          type: 'Body Weight',
          area: 'Cardio',
        },
        completed: false,
      },
      {
        id: 'kfkafoig9f0ed',
        logDate: parseISO('2019-07-22'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21'),
        },
        exercise: {
          id: 'fkfvibdj',
          name: 'Exercise Bike',
          description: 'Basic Biking',
          type: 'Machine',
          area: 'Cardio',
        },
        completed: false,
      },
      {
        id: 'fkfig09ekfek',
        logDate: parseISO('2019-07-24'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21'),
        },
        exercise: {
          id: 'kfkfigfid',
          name: 'Leg Curls',
          description: 'Basic Leg Curls',
          type: 'Machine',
          area: 'Lower Body',
        },
        completed: false,
      },
      {
        id: 'ifiifiigifi',
        logDate: parseISO('2019-07-22'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21'),
        },
        exercise: {
          id: 'iifgiifdie',
          name: 'Bench Press',
          description: 'Basic Press',
          type: 'Free Weight',
          area: 'Upper Body',
        },
        completed: false,
      },
      {
        id: 'firemyass',
        logDate: parseISO('2019-07-25'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21'),
        },
        exercise: {
          id: 'jadfoibdk',
          name: 'Jog',
          description: 'Uhg',
          type: 'Body Weight',
          area: 'Cardio',
        },
        completed: false,
      },
      {
        id: 'fiifigofdive',
        logDate: parseISO('2019-07-25'),
        workoutLog: {
          id: '199g009d8a',
          beginDate: parseISO('2019-07-21'),
        },
        exercise: {
          id: '1149953',
          name: 'Curls',
          description: 'Basic Biscept Curls',
          type: 'Free Weight',
          area: 'Upper Body',
        },
        completed: false,
      },
    ];
  }
});
