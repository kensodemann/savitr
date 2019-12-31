import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, AlertController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { ExercisesPage } from './exercises.page';
import { ExerciseEditorComponent } from 'src/app/editors/exercise-editor/exercise-editor.component';
import { ExercisesService } from '@app/services/firestore-data';

import { createExercisesServiceMock } from '@app/services/firestore-data/mocks';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { logout } from '@app/store/actions/auth.actions';

describe('ExercisesPage', () => {
  let alert;
  let component: ExercisesPage;
  let editor;
  let fixture: ComponentFixture<ExercisesPage>;

  beforeEach(async(() => {
    alert = createOverlayElementMock();
    editor = createOverlayElementMock();
    TestBed.configureTestingModule({
      declarations: [ExercisesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AlertController, useFactory: () => createOverlayControllerMock(alert) },
        { provide: ExercisesService, useFactory: createExercisesServiceMock },
        {
          provide: ModalController,
          useFactory: () => createOverlayControllerMock(editor)
        },
        provideMockStore()
      ]
    }).compileComponents();
  }));

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
  });

  describe('add', () => {
    it('creates a modal editor', () => {
      const modalController = TestBed.get(ModalController);
      component.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        backdropDismiss: false,
        component: ExerciseEditorComponent
      });
    });

    it('presents the editor', async () => {
      await component.add();
      expect(editor.present).toHaveBeenCalledTimes(1);
    });

    describe('if the "save" role was used', () => {
      it('updates the exercise', async () => {
        const service = TestBed.get(ExercisesService);
        editor.onDidDismiss.mockResolvedValue({
          data: {
            name: 'Squats',
            description: 'Not to be confused with squirts',
            area: 'Lower Body',
            type: 'Free Weights'
          },
          role: 'save'
        });
        await component.add();
        expect(service.add).toHaveBeenCalledTimes(1);
        expect(service.add).toHaveBeenCalledWith({
          name: 'Squats',
          description: 'Not to be confused with squirts',
          area: 'Lower Body',
          type: 'Free Weights'
        });
      });
    });

    describe('if editing was cancelled without saving', () => {
      it('does not update the exercise', async () => {
        const service = TestBed.get(ExercisesService);
        await component.add();
        expect(service.add).not.toHaveBeenCalled();
      });
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
        backdropDismiss: false,
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

    describe('if the "save" role was used', () => {
      it('updates the exercise', async () => {
        const service = TestBed.get(ExercisesService);
        editor.onDidDismiss.mockResolvedValue({
          data: {
            id: '420059399405',
            name: 'Squats',
            description: 'Not to be confused with squirts',
            area: 'Lower Body',
            type: 'Free Weights'
          },
          role: 'save'
        });
        await component.edit(exercise);
        expect(service.update).toHaveBeenCalledTimes(1);
        expect(service.update).toHaveBeenCalledWith({
          id: '420059399405',
          name: 'Squats',
          description: 'Not to be confused with squirts',
          area: 'Lower Body',
          type: 'Free Weights'
        });
      });
    });

    describe('if editing was cancelled without saving', () => {
      it('does not update the exercise', async () => {
        const service = TestBed.get(ExercisesService);
        await component.edit(exercise);
        expect(service.update).not.toHaveBeenCalled();
      });
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
      alert.onDidDismiss.mockResolvedValue({});
    });

    it('asks the user if they actually want to delete', () => {
      const alertController = TestBed.get(AlertController);
      component.delete(exercise);
      expect(alertController.create).toHaveBeenCalledTimes(1);
      expect(alertController.create).toHaveBeenCalledWith({
        header: 'Remove Exercise?',
        subHeader: exercise.name,
        message: 'This action cannot be undone. Are you sure you want to continue?',
        buttons: [
          { text: 'Yes', role: 'confirm' },
          { text: 'No', role: 'cancel' }
        ]
      });
    });

    it('presents the alert', async () => {
      await component.delete(exercise);
      expect(alert.present).toHaveBeenCalledTimes(1);
    });

    it('does the delete if the "confirm" button is pressed', async () => {
      const svc = TestBed.get(ExercisesService);
      alert.onDidDismiss.mockResolvedValue({ role: 'confirm' });
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
      alert.onDidDismiss.mockResolvedValue({ role: 'cancel' });
      await component.delete(exercise);
      expect(svc.delete).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('dispatches the logout action', () => {
      const store = TestBed.get(Store);
      store.dispatch = jest.fn();
      component.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
  });
});
