import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ExerciseFinderComponent } from '@app/shared';
import { IonicModule, ModalController } from '@ionic/angular';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { parseISO } from 'date-fns';
import { LogEntryEditorComponent } from './log-entry-editor.component';

describe('LogEntryEditorComponent', () => {
  let component: LogEntryEditorComponent;
  let fixture: ComponentFixture<LogEntryEditorComponent>;
  let modal: any;

  beforeEach(
    waitForAsync(() => {
      modal = createOverlayElementMock();
      TestBed.configureTestingModule({
        declarations: [LogEntryEditorComponent],
        imports: [FormsModule, IonicModule],
        providers: [{ provide: ModalController, useFactory: () => createOverlayControllerMock(modal) }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LogEntryEditorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on initialize', () => {
    describe('when a log entry is set', () => {
      beforeEach(() => {
        component.workoutLogEntry = {
          workoutLog: {
            id: '1234j99g0d',
            beginDate: parseISO('2019-09-08'),
          },
          logDate: parseISO('2019-09-10'),
          exercise: {
            id: '773758FC3',
            name: 'Dumbbell Bench Press',
            description: 'Bench press using two dumbbells',
            area: 'Upper Body',
            type: 'Free Weight',
          },
          time: '1:45',
          sets: 4,
          reps: 12,
          weight: 35,
          completed: false,
        };
        fixture.detectChanges();
      });

      it('sets the title to "Edit Exercise"', () => {
        expect(component.title).toEqual('Edit Exercise');
      });

      it('initializes editable fields', () => {
        expect(component.time).toEqual('1:45');
        expect(component.sets).toEqual(4);
        expect(component.reps).toEqual(12);
        expect(component.weight).toEqual(35);
        expect(component.exercise).toEqual({
          id: '773758FC3',
          name: 'Dumbbell Bench Press',
          description: 'Bench press using two dumbbells',
          area: 'Upper Body',
          type: 'Free Weight',
        });
      });
    });

    describe('when a log entry is not set', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('sets the title to "Add Exercise"', () => {
        expect(component.title).toEqual('Add Exercise');
      });
    });
  });

  describe('finding an exercise', () => {
    beforeEach(() => {
      modal.onDidDismiss.mockResolvedValue({});
    });

    it('creates the search modal', async () => {
      const modalController = TestBed.inject(ModalController);
      await component.findExercise();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({ component: ExerciseFinderComponent });
    });

    it('presents the modal', async () => {
      await component.findExercise();
      expect(modal.present).toHaveBeenCalledTimes(1);
    });

    it('waits for the modal to be dismissed', async () => {
      await component.findExercise();
      expect(modal.onDidDismiss).toHaveBeenCalledTimes(1);
    });

    it('sets the exercise if the role is "select"', async () => {
      modal.onDidDismiss.mockResolvedValue({
        data: {
          id: '9930408A3',
          name: 'Elliptical',
          description: 'Low impact glide-running',
          area: 'Cardio',
          type: 'Machine',
        },
        role: 'select',
      });
      await component.findExercise();
      expect(component.exercise).toEqual({
        id: '9930408A3',
        name: 'Elliptical',
        description: 'Low impact glide-running',
        area: 'Cardio',
        type: 'Machine',
      });
    });

    it('does not set the exercise if the role is not "select"', async () => {
      modal.onDidDismiss.mockResolvedValue({
        data: {
          id: '9930408A3',
          name: 'Elliptical',
          description: 'Low impact glide-running',
          area: 'Cardio',
          type: 'Machine',
        },
        role: 'not-select',
      });
      await component.findExercise();
      expect(component.exercise).toEqual(undefined);
    });
  });

  describe('close', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('dismisses the modal', () => {
      const modalController = TestBed.inject(ModalController);
      component.close();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });

    it('does not return any data', () => {
      const modalController = TestBed.inject(ModalController);
      component.close();
      expect(modalController.dismiss).toHaveBeenCalledWith();
    });
  });

  describe('can save', () => {
    it('is false by default', () => {
      expect(component.canSave).toEqual(false);
    });

    it('is false if there is just an excercise', () => {
      component.exercise = {
        id: '9930408A3',
        name: 'Elliptical',
        description: 'Low impact glide-running',
        area: 'Cardio',
        type: 'Machine',
      };
      expect(component.canSave).toEqual(false);
    });

    it('is false if there is just an excercise and sets', () => {
      component.exercise = {
        id: '9930408A3',
        name: 'Elliptical',
        description: 'Low impact glide-running',
        area: 'Cardio',
        type: 'Machine',
      };
      component.sets = 4;
      expect(component.canSave).toEqual(false);
    });

    it('is false if there is just an excercise and weight', () => {
      component.exercise = {
        id: '9930408A3',
        name: 'Elliptical',
        description: 'Low impact glide-running',
        area: 'Cardio',
        type: 'Machine',
      };
      component.weight = 150;
      expect(component.canSave).toEqual(false);
    });

    it('is true if there is an excercise and time', () => {
      component.exercise = {
        id: '9930408A3',
        name: 'Elliptical',
        description: 'Low impact glide-running',
        area: 'Cardio',
        type: 'Machine',
      };
      component.time = '1:30';
      expect(component.canSave).toEqual(true);
    });

    it('is true if there is an excercise, sets, and reps', () => {
      component.exercise = {
        id: '9930408A3',
        name: 'Elliptical',
        description: 'Low impact glide-running',
        area: 'Cardio',
        type: 'Machine',
      };
      component.sets = 4;
      component.reps = 12;
      expect(component.canSave).toEqual(true);
    });
  });

  describe('save', () => {
    describe('an existing workout log entry', () => {
      beforeEach(() => {
        component.workoutLogEntry = {
          id: 'sdfit9932530',
          workoutLog: {
            id: '3834995304',
            beginDate: parseISO('2019-09-15'),
          },
          logDate: parseISO('2019-09-17'),
          exercise: {
            id: '773758FC3',
            name: 'Dumbbell Bench Press',
            description: 'Bench press using two dumbbells',
            area: 'Upper Body',
            type: 'Free Weight',
          },
          time: '1:45',
          sets: 4,
          reps: 12,
          weight: 35,
          completed: true,
        };
        fixture.detectChanges();
      });
      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('uses the "save" role', () => {
        const modalController = TestBed.inject(ModalController);
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledWith(jasmine.any(Object), 'save');
      });

      it('returns the exercise / time data', () => {
        const modalController = TestBed.inject(ModalController);
        component.exercise = {
          id: '39940AB39',
          name: 'Barbell Bench Press',
          description: 'Standard bench press',
          area: 'Upper Body',
          type: 'Free Weight',
        };
        component.time = '2:00';
        component.sets = undefined;
        component.reps = undefined;
        component.weight = undefined;
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledWith(
          {
            id: 'sdfit9932530',
            workoutLog: {
              id: '3834995304',
              beginDate: parseISO('2019-09-15'),
            },
            logDate: parseISO('2019-09-17'),
            exercise: {
              id: '39940AB39',
              name: 'Barbell Bench Press',
              description: 'Standard bench press',
              area: 'Upper Body',
              type: 'Free Weight',
            },
            time: '2:00',
            completed: true,
          },
          jasmine.any(String)
        );
      });

      it('returns the exercise / set / rep / weight data', () => {
        const modalController = TestBed.inject(ModalController);
        component.exercise = {
          id: '39940AB39',
          name: 'Barbell Bench Press',
          description: 'Standard bench press',
          area: 'Upper Body',
          type: 'Free Weight',
        };
        component.time = '';
        component.sets = 3;
        component.reps = 15;
        component.weight = 85;
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledWith(
          {
            id: 'sdfit9932530',
            workoutLog: {
              id: '3834995304',
              beginDate: parseISO('2019-09-15'),
            },
            logDate: parseISO('2019-09-17'),
            exercise: {
              id: '39940AB39',
              name: 'Barbell Bench Press',
              description: 'Standard bench press',
              area: 'Upper Body',
              type: 'Free Weight',
            },
            sets: 3,
            reps: 15,
            weight: 85,
            completed: true,
          },
          jasmine.any(String)
        );
      });
    });

    describe('a new workout log entry', () => {
      beforeEach(() => {
        component.logDate = parseISO('2019-09-10');
        component.workoutLog = {
          id: '1234j99g0d',
          beginDate: parseISO('2019-09-08'),
        };
        fixture.detectChanges();
      });

      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('uses the "save" role', () => {
        const modalController = TestBed.inject(ModalController);
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledWith(jasmine.any(Object), 'save');
      });

      it('returns the exercise / time data', () => {
        const modalController = TestBed.inject(ModalController);
        component.exercise = {
          id: '773758FC3',
          name: 'Dumbbell Bench Press',
          description: 'Bench press using two dumbbells',
          area: 'Upper Body',
          type: 'Free Weight',
        };
        component.time = '1:45';
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledWith(
          {
            workoutLog: {
              id: '1234j99g0d',
              beginDate: parseISO('2019-09-08'),
            },
            logDate: parseISO('2019-09-10'),
            exercise: {
              id: '773758FC3',
              name: 'Dumbbell Bench Press',
              description: 'Bench press using two dumbbells',
              area: 'Upper Body',
              type: 'Free Weight',
            },
            time: '1:45',
            completed: false,
          },
          jasmine.any(String)
        );
      });

      it('returns the exercise / set / rep / weight data', () => {
        const modalController = TestBed.inject(ModalController);
        component.exercise = {
          id: '773758FC3',
          name: 'Dumbbell Bench Press',
          description: 'Bench press using two dumbbells',
          area: 'Upper Body',
          type: 'Free Weight',
        };
        component.sets = 4;
        component.reps = 12;
        component.weight = 50;
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledWith(
          {
            workoutLog: {
              id: '1234j99g0d',
              beginDate: parseISO('2019-09-08'),
            },
            logDate: parseISO('2019-09-10'),
            exercise: {
              id: '773758FC3',
              name: 'Dumbbell Bench Press',
              description: 'Bench press using two dumbbells',
              area: 'Upper Body',
              type: 'Free Weight',
            },
            sets: 4,
            reps: 12,
            weight: 50,
            completed: false,
          },
          jasmine.any(String)
        );
      });
    });
  });
});
