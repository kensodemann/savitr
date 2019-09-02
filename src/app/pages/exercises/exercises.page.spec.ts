import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, AlertController } from '@ionic/angular';

import { ExercisesPage } from './exercises.page';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ExerciseEditorComponent } from 'src/app/editors/exercise-editor/exercise-editor.component';
import { ExercisesService } from '@app/services/firestore-data';

import { createAuthenticationServiceMock } from 'src/app/services/authentication/authentication.service.mock';
import { createExercisesServiceMock } from '@app/services/firestore-data/mocks';
import { createOverlayControllerMock, createOverlayElementMock } from 'test/mocks';
import { Exercise } from 'src/app/models/exercise';
import { Subject } from 'rxjs';
import { ExerciseFocusAreas } from 'src/app/default-data';

describe('ExercisesPage', () => {
  let alert;
  let component: ExercisesPage;
  let editor;
  let exercisesList: Subject<Array<Exercise>>;
  let exercises: Array<Exercise>;
  let sortedExercises: Array<{ area: string; exercises: Array<Exercise> }>;
  let fixture: ComponentFixture<ExercisesPage>;

  beforeEach(async(() => {
    initiailzeTestData();
    alert = createOverlayElementMock('Alert');
    editor = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      declarations: [ExercisesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AlertController, useFactory: () => createOverlayControllerMock('AlertController', alert) },
        { provide: AuthenticationService, useFactory: createAuthenticationServiceMock },
        { provide: ExercisesService, useFactory: createExercisesServiceMock },
        {
          provide: ModalController,
          useFactory: () => createOverlayControllerMock('ModalController', editor)
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    const svc = TestBed.get(ExercisesService);
    exercisesList = new Subject();
    svc.all.and.returnValue(exercisesList);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('builds', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('sets up an observable on the exercises', () => {
      const svc = TestBed.get(ExercisesService);
      expect(svc.all).toHaveBeenCalledTimes(1);
    });

    it('sets the exercises to the sorted list of exercises segregated by area', () => {
      exercisesList.next(exercises);
      expect(component.exercisesByArea).toEqual(sortedExercises);
    });
  });

  describe('add', () => {
    it('creates a modal editor', () => {
      const modalController = TestBed.get(ModalController);
      component.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: ExerciseEditorComponent
      });
    });

    it('presents the editor', async () => {
      await component.add();
      expect(editor.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('edit', () => {
    const exercise = {
      id: '420059399405',
      name: 'Push Back',
      description: 'Find something you do not like, rebel against it',
      type: 'Body Weight',
      area: 'Core'
    };

    it('creates a modal editor', () => {
      const modalController = TestBed.get(ModalController);
      component.edit(exercise);
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: ExerciseEditorComponent,
        componentProps: {
          exercise
        }
      });
    });

    it('presents the editor', async () => {
      await component.edit(exercise);
      expect(editor.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    const exercise = {
      id: '420059399405',
      name: 'Push Back',
      description: 'Find something you do not like, rebel against it',
      type: 'Body Weight',
      area: 'Core'
    };

    beforeEach(() => {
      alert.onDidDismiss.and.returnValue(Promise.resolve({}));
    });

    it('asks the user if they actually want to delete', () => {
      const alertController = TestBed.get(AlertController);
      component.delete(exercise);
      expect(alertController.create).toHaveBeenCalledTimes(1);
      expect(alertController.create).toHaveBeenCalledWith({
        header: 'Remove Exercise?',
        subHeader: exercise.name,
        message: 'This action cannot be undone. Are you sure you want to continue?',
        buttons: [{ text: 'Yes', role: 'confirm' }, { text: 'No', role: 'cancel' }]
      });
    });

    it('presents the alert', async () => {
      await component.delete(exercise);
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    it('does the delete if the "confirm" button is pressed', async () => {
      const svc = TestBed.get(ExercisesService);
      alert.onDidDismiss.and.returnValue(Promise.resolve({ role: 'confirm' }));
      await component.delete(exercise);
      expect(svc.delete).toHaveBeenCalledTimes(1);
      expect(svc.delete).toHaveBeenCalledWith({
        id: '420059399405',
        name: 'Push Back',
        description: 'Find something you do not like, rebel against it',
        type: 'Body Weight',
        area: 'Core'
      });
    });

    it('does not do the delete if the "confirm" button is pressed', async () => {
      const svc = TestBed.get(ExercisesService);
      alert.onDidDismiss.and.returnValue(Promise.resolve({ role: 'cancel' }));
      await component.delete(exercise);
      expect(svc.delete).not.toHaveBeenCalled();
    });
  });

  function initiailzeTestData() {
    exercises = [
      {
        id: '388495883',
        name: 'Bench Press',
        description: 'Standard bench press with a barbell',
        area: 'Upper Body',
        type: 'Free Weight'
      },
      {
        id: 'A98503BEF',
        name: 'Sit-up',
        description: 'Lay on back with legs bent, sit up fully',
        area: 'Core',
        type: 'Body Weight'
      },
      {
        id: '9930408A3',
        name: 'Elliptical',
        description: 'Low impact glide-running',
        area: 'Cardio',
        type: 'Machine'
      },
      {
        id: '3885723475',
        name: 'Matrix Bench Press',
        description: 'Bench press using a machine',
        area: 'Upper Body',
        type: 'Machine'
      },
      {
        id: '773758FC3',
        name: 'Dumbbell Bench Press',
        description: 'Bench press using two dumbbells',
        area: 'Upper Body',
        type: 'Free Weight'
      }
    ];
    sortedExercises = [
      {
        area: ExerciseFocusAreas.Cardio,
        exercises: [
          {
            id: '9930408A3',
            name: 'Elliptical',
            description: 'Low impact glide-running',
            area: 'Cardio',
            type: 'Machine'
          }
        ]
      },
      {
        area: ExerciseFocusAreas.Core,
        exercises: [
          {
            id: 'A98503BEF',
            name: 'Sit-up',
            description: 'Lay on back with legs bent, sit up fully',
            area: 'Core',
            type: 'Body Weight'
          }
        ]
      },
      {
        area: ExerciseFocusAreas.UpperBody,
        exercises: [
          {
            id: '388495883',
            name: 'Bench Press',
            description: 'Standard bench press with a barbell',
            area: 'Upper Body',
            type: 'Free Weight'
          },
          {
            id: '773758FC3',
            name: 'Dumbbell Bench Press',
            description: 'Bench press using two dumbbells',
            area: 'Upper Body',
            type: 'Free Weight'
          },
          {
            id: '3885723475',
            name: 'Matrix Bench Press',
            description: 'Bench press using a machine',
            area: 'Upper Body',
            type: 'Machine'
          }
        ]
      },
      { area: ExerciseFocusAreas.LowerBody, exercises: [] },
      { area: ExerciseFocusAreas.FullBody, exercises: [] }
    ];
  }
});
