import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { ExercisesPage } from './exercises.page';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ExerciseEditorComponent } from 'src/app/editors/exercise-editor/exercise-editor.component';
import { ExercisesService } from 'src/app/services/firestore-data/exercises/exercises.service';

import { createAuthenticationServiceMock } from 'src/app/services/authentication/authentication.service.mock';
import { createExercisesServiceMock } from 'src/app/services/firestore-data/exercises/exercises.service.mock';
import { createOverlayControllerMock, createOverlayElementMock } from 'test/mocks';
import { Exercise } from 'src/app/models/exercise';
import { Subject } from 'rxjs';
import { ExerciseFocusAreas } from 'src/app/default-data';

describe('ExercisesPage', () => {
  let component: ExercisesPage;
  let editor;
  let exercisesList: Subject<Array<Exercise>>;
  let exercises: Array<Exercise>;
  let sortedExercises: Array<{ area: string; exercises: Array<Exercise> }>;
  let fixture: ComponentFixture<ExercisesPage>;

  beforeEach(async(() => {
    initiailzeTestData();
    editor = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      declarations: [ExercisesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
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
      const svc = TestBed.get(ExercisesService);
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
      const modalController = TestBed.get(ModalController);
      await component.add();
      expect(editor.present).toHaveBeenCalledTimes(1);
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
