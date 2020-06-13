import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Exercise } from '@app/models';
import { ExerciseFocusAreas } from '@app/default-data';
import { ExerciseListComponent } from './exercise-list.component';

describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;

  let exercises: Array<Exercise>;
  let sortedExercises: Array<{ area: string; exercises: Array<Exercise> }>;

  beforeEach(async(() => {
    initiailzeTestData();
    TestBed.configureTestingModule({
      declarations: [ExerciseListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

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
