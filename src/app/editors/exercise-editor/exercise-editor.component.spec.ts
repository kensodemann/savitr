import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { exerciseFocusAreas, exerciseTypes } from '@app/default-data';
import { IonicModule, ModalController } from '@ionic/angular';
import { createOverlayControllerMock } from '@test/mocks';
import { ExerciseEditorComponent } from './exercise-editor.component';

describe('ExerciseEditorComponent', () => {
  let component: ExerciseEditorComponent;
  let fixture: ComponentFixture<ExerciseEditorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ExerciseEditorComponent],
        imports: [FormsModule, IonicModule],
        providers: [{ provide: ModalController, useFactory: () => createOverlayControllerMock() }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

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
          type: 'Free Weights',
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
      const modalController = TestBed.inject(ModalController);
      component.close();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    describe('without an exercise', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('closes the editor', async () => {
        const modalController = TestBed.inject(ModalController);
        await component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('returns the editted exercise', () => {
        const modalController = TestBed.inject(ModalController);
        component.area = component.areas[2];
        component.type = component.types[1];
        component.name = 'Bench Press';
        component.description = 'Lay down, push weight off chest to prevent crushing';
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledWith(
          {
            name: 'Bench Press',
            description: 'Lay down, push weight off chest to prevent crushing',
            area: component.areas[2],
            type: component.types[1],
          },
          jasmine.any(String)
        );
      });

      it('uses the "save" role', () => {
        const modalController = TestBed.inject(ModalController);
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledWith(jasmine.any(Object), 'save');
      });
    });

    describe('with an exercise', () => {
      beforeEach(() => {
        component.exercise = {
          id: '428588494',
          name: 'Squats',
          description: 'Not to be confused with squirts',
          area: 'Lower Body',
          type: 'Free Weights',
        };
        fixture.detectChanges();
      });

      it('closes the editor', async () => {
        const modalController = TestBed.inject(ModalController);
        await component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });

      it('returns the editted exercise', () => {
        const modalController = TestBed.inject(ModalController);
        component.area = component.areas[1];
        component.type = component.types[2];
        component.name = 'Bench Press';
        component.description = 'Lay down, push weight off chest to prevent crushing';
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledWith(
          {
            id: '428588494',
            name: 'Bench Press',
            description: 'Lay down, push weight off chest to prevent crushing',
            area: component.areas[1],
            type: component.types[2],
          },
          jasmine.any(String)
        );
      });

      it('uses the "save" role', () => {
        const modalController = TestBed.inject(ModalController);
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledWith(jasmine.any(Object), 'save');
      });
    });
  });
});
