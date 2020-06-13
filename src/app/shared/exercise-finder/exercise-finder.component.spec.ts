import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Dictionary } from '@ngrx/entity';
import { provideMockStore } from '@ngrx/store/testing';

import { ExerciseFinderComponent } from './exercise-finder.component';
import { Exercise } from '@app/models';
import { ExercisesState } from '@app/store/reducers/exercise/exercise.reducer';
import { ModalController } from '@ionic/angular';

import { createOverlayControllerMock } from '@test/mocks';

describe('ExerciseFinderComponent', () => {
  let component: ExerciseFinderComponent;
  let fixture: ComponentFixture<ExerciseFinderComponent>;

  let testExercises: Dictionary<Exercise>;
  let testExerciseIds: Array<string>;

  beforeEach(async(() => {
    initiailzeTestData();
    TestBed.configureTestingModule({
      declarations: [ExerciseFinderComponent],
      providers: [
        { provide: ModalController, useFactory: () => createOverlayControllerMock() },
        provideMockStore<{ exercises: ExercisesState }>({
          initialState: { exercises: { ids: testExerciseIds, entities: testExercises, loading: false } }
        })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filtering', () => {
    it('defaults to all exercises', () => {
      let exercises: Array<Exercise>;
      component.exercises$.subscribe(e => (exercises = e));
      expect(exercises).toEqual([
        testExercises[testExerciseIds[0]],
        testExercises[testExerciseIds[1]],
        testExercises[testExerciseIds[2]],
        testExercises[testExerciseIds[3]],
        testExercises[testExerciseIds[4]]
      ]);
    });

    it('limits to the entered value', () => {
      component.applyFilter('press');
      component.exercises$.subscribe(e => {
        expect(e).toEqual([
          {
            id: '388495883',
            name: 'Bench Press',
            description: 'Standard bench press with a barbell',
            area: 'Upper Body',
            type: 'Free Weight'
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
        ]);
      });
    });
  });

  describe('selecting an exercise', () => {
    it('dismisses the modal', () => {
      const modalController = TestBed.inject(ModalController);
      component.select(testExercises.A98503BEF);
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });

    it('passes back the selected exercise', () => {
      const modalController = TestBed.inject(ModalController);
      component.select(testExercises.A98503BEF);
      expect(modalController.dismiss).toHaveBeenCalledWith(testExercises.A98503BEF, 'select');
    });
  });

  function initiailzeTestData() {
    testExercises = {
      388495883: {
        id: '388495883',
        name: 'Bench Press',
        description: 'Standard bench press with a barbell',
        area: 'Upper Body',
        type: 'Free Weight'
      },
      A98503BEF: {
        id: 'A98503BEF',
        name: 'Sit-up',
        description: 'Lay on back with legs bent, sit up fully',
        area: 'Core',
        type: 'Body Weight'
      },
      '9930408A3': {
        id: '9930408A3',
        name: 'Elliptical',
        description: 'Low impact glide-running',
        area: 'Cardio',
        type: 'Machine'
      },
      3885723475: {
        id: '3885723475',
        name: 'Matrix Bench Press',
        description: 'Bench press using a machine',
        area: 'Upper Body',
        type: 'Machine'
      },
      '773758FC3': {
        id: '773758FC3',
        name: 'Dumbbell Bench Press',
        description: 'Bench press using two dumbbells',
        area: 'Upper Body',
        type: 'Free Weight'
      }
    };
    testExerciseIds = ['388495883', 'A98503BEF', '9930408A3', '3885723475', '773758FC3'];
  }
});
