import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Exercise } from '@app/models';
import { ExercisesService } from '@app/services/firestore-data';
import { createExercisesServiceMock } from '@app/services/firestore-data/mocks';
import { ModalController } from '@ionic/angular';
import { createOverlayControllerMock } from '@test/mocks';
import { of } from 'rxjs';
import { ExerciseFinderComponent } from './exercise-finder.component';

describe('ExerciseFinderComponent', () => {
  let component: ExerciseFinderComponent;
  let exercises: Array<Exercise>;
  let fixture: ComponentFixture<ExerciseFinderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ExerciseFinderComponent],
        providers: [
          { provide: ExercisesService, useFactory: createExercisesServiceMock },
          { provide: ModalController, useFactory: () => createOverlayControllerMock() },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    initiailzeTestData();
    fixture = TestBed.createComponent(ExerciseFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filtering', () => {
    beforeEach(() => {
      const srv = TestBed.inject(ExercisesService);
      (srv.all as any).mockReturnValue(of(exercises));
    });

    it('defaults to all exercises', () => {
      component.exercises$.subscribe((e) => expect(e).toEqual(exercises));
    });

    it('limits to the entered value', () => {
      component.applyFilter('press');
      component.exercises$.subscribe((e) => {
        expect(e).toEqual([
          {
            id: '388495883',
            name: 'Bench Press',
            description: 'Standard bench press with a barbell',
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
          {
            id: '773758FC3',
            name: 'Dumbbell Bench Press',
            description: 'Bench press using two dumbbells',
            area: 'Upper Body',
            type: 'Free Weight',
          },
        ]);
      });
    });
  });

  describe('selecting an exercise', () => {
    it('dismisses the modal', () => {
      const modalController = TestBed.inject(ModalController);
      component.select(exercises[1]);
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });

    it('passes back the selected exercise', () => {
      const modalController = TestBed.inject(ModalController);
      component.select(exercises[1]);
      expect(modalController.dismiss).toHaveBeenCalledWith(exercises[1], 'select');
    });
  });

  function initiailzeTestData() {
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
  }
});
