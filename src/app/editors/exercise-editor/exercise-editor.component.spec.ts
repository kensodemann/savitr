import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { ExerciseEditorComponent } from './exercise-editor.component';
import { ExercisesService } from '@app/services/firestore-data';
import { exerciseFocusAreas, exerciseTypes } from '@app/default-data';

import { createOverlayControllerMock } from 'test/mocks';
import { createExercisesServiceMock } from '@app/services/firestore-data/mocks';

describe('ExerciseEditorComponent', () => {
  let component: ExerciseEditorComponent;
  let fixture: ComponentFixture<ExerciseEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciseEditorComponent],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: ExercisesService, useFactory: createExercisesServiceMock },
        { provide: ModalController, useFactory: () => createOverlayControllerMock('ModalController') }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseEditorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('copies the areas', () => {
      fixture.detectChanges();
      expect(component.areas).toEqual(exerciseFocusAreas);
      expect(component.areas).not.toBe(exerciseFocusAreas);
    });

    it('copies the types', () => {
      fixture.detectChanges();
      expect(component.types).toEqual(exerciseTypes);
      expect(component.types).not.toBe(exerciseTypes);
    });

    describe('without an exercise', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('sets the title', () => {
        expect(component.title).toEqual('Add Exercise');
      });

      it('has blank binding values', () => {
        expect(component.name).toEqual('');
        expect(component.description).toEqual('');
        expect(component.type).toEqual('');
        expect(component.area).toEqual('');
      });
    });

    describe('with an exercise', () => {
      beforeEach(() => {
        component.exercise = {
          id: '428588494',
          name: 'Squats',
          description: 'Not to be confused with squirts',
          area: 'Lower Body',
          type: 'Free Weights'
        };
        fixture.detectChanges();
      });

      it('sets the title', () => {
        expect(component.title).toEqual('Update Exercise');
      });

      it('initializes the binding values', () => {
        expect(component.name).toEqual('Squats');
        expect(component.description).toEqual('Not to be confused with squirts');
        expect(component.type).toEqual('Free Weights');
        expect(component.area).toEqual('Lower Body');
      });
    });
  });

  describe('close', () => {
    it('closes the editor', () => {
      const modalController = TestBed.get(ModalController);
      component.close();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    describe('without an exercise', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('adds the exercise', () => {
        const exercisesService = TestBed.get(ExercisesService);
        component.save();
        expect(exercisesService.add).toHaveBeenCalledTimes(1);
      });

      it('properly builds the exercise being added', () => {
        const exercisesService = TestBed.get(ExercisesService);
        component.area = component.areas[2];
        component.type = component.types[1];
        component.name = 'Bench Press';
        component.description = 'Lay down, push weight off chest to prevent crushing';
        component.save();
        expect(exercisesService.add).toHaveBeenCalledWith({
          name: 'Bench Press',
          description: 'Lay down, push weight off chest to prevent crushing',
          area: component.areas[2],
          type: component.types[1]
        });
      });

      it('closes the editor', async () => {
        const modalController = TestBed.get(ModalController);
        await component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('with an exercise', () => {
      beforeEach(() => {
        component.exercise = {
          id: '428588494',
          name: 'Squats',
          description: 'Not to be confused with squirts',
          area: 'Lower Body',
          type: 'Free Weights'
        };
        fixture.detectChanges();
      });

      it('updates the exercise', () => {
        const exercisesService = TestBed.get(ExercisesService);
        component.save();
        expect(exercisesService.update).toHaveBeenCalledTimes(1);
      });

      it('properly builds the exercise being added', () => {
        const exercisesService = TestBed.get(ExercisesService);
        component.area = component.areas[1];
        component.type = component.types[2];
        component.name = 'Bench Press';
        component.description = 'Lay down, push weight off chest to prevent crushing';
        component.save();
        expect(exercisesService.update).toHaveBeenCalledWith({
          id: '428588494',
          name: 'Bench Press',
          description: 'Lay down, push weight off chest to prevent crushing',
          area: component.areas[1],
          type: component.types[2]
        });
      });

      it('closes the editor', async () => {
        const modalController = TestBed.get(ModalController);
        await component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });
});
