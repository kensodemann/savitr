import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ExerciseFocusAreas } from '@app/default-data';
import { Exercise } from '@app/models';
import { ExercisesService } from '@app/services/firestore-data';
import { createExercisesServiceMock } from '@app/services/firestore-data/mocks';
import { ExerciseListComponent } from './exercise-list.component';

describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;

  let exercises: Array<Exercise>;
  let sortedExercises: Array<{ area: string; exercises: Array<Exercise> }>;

  beforeEach(
    waitForAsync(() => {
      initiailzeTestData();
      TestBed.configureTestingModule({
        declarations: [ExerciseListComponent],
        providers: [{ provide: ExercisesService, useFactory: createExercisesServiceMock }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setting the exercises input', () => {
    it('segregates and sorts the exercises by area', () => {
      component.exercises = exercises;
      expect(component.exercisesByArea).toEqual(sortedExercises);
    });

    it('does not crash if there is no data', () => {
      component.exercises = null;
      expect(component.exercisesByArea).toEqual([]);
    });
  });

  const initiailzeTestData = () => {
    exercises = [
      {
        id: '388495883',
        name: 'Bench Press',
        description: 'Standard bench press with a barbell',
        area: 'Upper Body',
        type: 'Free Weight',
      },
      {
        id: 'A98503BEF',
        name: 'Sit-up',
        description: 'Lay on back with legs bent, sit up fully',
        area: 'Core',
        type: 'Body Weight',
      },
      {
        id: '9930408A3',
        name: 'Elliptical',
        description: 'Low impact glide-running',
        area: 'Cardio',
        type: 'Machine',
      },
      {
        id: '3885723475',
        name: 'Matrix Bench Press',
        description: 'Bench press using a machine',
        area: 'Upper Body',
        type: 'Machine',
      },
      {
        id: '773758FC3',
        name: 'Dumbbell Bench Press',
        description: 'Bench press using two dumbbells',
        area: 'Upper Body',
        type: 'Free Weight',
      },
    ];
    sortedExercises = [
      {
        area: ExerciseFocusAreas.cardio,
        exercises: [
          {
            id: '9930408A3',
            name: 'Elliptical',
            description: 'Low impact glide-running',
            area: 'Cardio',
            type: 'Machine',
          },
        ],
      },
      {
        area: ExerciseFocusAreas.core,
        exercises: [
          {
            id: 'A98503BEF',
            name: 'Sit-up',
            description: 'Lay on back with legs bent, sit up fully',
            area: 'Core',
            type: 'Body Weight',
          },
        ],
      },
      {
        area: ExerciseFocusAreas.upperBody,
        exercises: [
          {
            id: '388495883',
            name: 'Bench Press',
            description: 'Standard bench press with a barbell',
            area: 'Upper Body',
            type: 'Free Weight',
          },
          {
            id: '773758FC3',
            name: 'Dumbbell Bench Press',
            description: 'Bench press using two dumbbells',
            area: 'Upper Body',
            type: 'Free Weight',
          },
          {
            id: '3885723475',
            name: 'Matrix Bench Press',
            description: 'Bench press using a machine',
            area: 'Upper Body',
            type: 'Machine',
          },
        ],
      },
      { area: ExerciseFocusAreas.lowerBody, exercises: [] },
      { area: ExerciseFocusAreas.fullBody, exercises: [] },
    ];
  };
});
