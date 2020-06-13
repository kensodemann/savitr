import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, AlertController } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';

import { ExercisesPage } from './exercises.page';
import { ExerciseEditorComponent } from 'src/app/editors/exercise-editor/exercise-editor.component';
import { ExercisesState } from '@app/store/reducers/exercise/exercise.reducer';
import { Exercise } from '@app/models';

import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { logout } from '@app/store/actions/auth.actions';
import { remove } from '@app/store/actions/exercise.actions';

describe('ExercisesPage', () => {
  let alert: any;
  let component: ExercisesPage;
  let editor: any;
  let fixture: ComponentFixture<ExercisesPage>;

  let testExercises: Dictionary<Exercise>;
  let testExerciseIds: Array<string>;

  beforeEach(async(() => {
    initializeTestData();
    alert = createOverlayElementMock();
    editor = createOverlayElementMock();
    TestBed.configureTestingModule({
      declarations: [ExercisesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AlertController, useFactory: () => createOverlayControllerMock(alert) },
        {
          provide: ModalController,
          useFactory: () => createOverlayControllerMock(editor)
        },
        provideMockStore<{ exercises: ExercisesState }>({
          initialState: { exercises: { ids: testExerciseIds, entities: testExercises, loading: false } }
        })
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
    it('observes the exercises', () => {
      let exercises: Array<Exercise>;
      component.exercises$.subscribe(e => (exercises = e));
      expect(exercises).toEqual([
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
      ]);
    });
  });

  describe('add', () => {
    it('creates a modal editor', () => {
      const modalController = TestBed.inject(ModalController);
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
      const modalController = TestBed.inject(ModalController);
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
      const alertController = TestBed.inject(AlertController);
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

    it('dispatches the remove if the "confirm" button is pressed', async () => {
      const store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      alert.onDidDismiss.mockResolvedValue({ role: 'confirm' });
      await component.delete(exercise);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(remove({ exercise }));
      (store.dispatch as any).mockRestore();
    });

    it('does not dispatch the remove delete if the "confirm" button is not pressed', async () => {
      const store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      alert.onDidDismiss.mockResolvedValue({ role: 'cancel' });
      await component.delete(exercise);
      expect(store.dispatch).not.toHaveBeenCalled();
      (store.dispatch as any).mockRestore();
    });
  });

  describe('logout', () => {
    it('dispatches the logout action', () => {
      const store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      component.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
      (store.dispatch as any).mockRestore();
    });
  });

  function initializeTestData() {
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
