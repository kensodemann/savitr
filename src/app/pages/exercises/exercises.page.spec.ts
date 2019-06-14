import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { ExercisesPage } from './exercises.page';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ExerciseEditorComponent } from 'src/app/editors/exercise-editor/exercise-editor.component';

import { createAuthenticationServiceMock } from '../../services/authentication/authentication.service.mock';
import { createOverlayControllerMock, createOverlayElementMock } from 'test/mocks';

describe('ExercisesPage', () => {
  let component: ExercisesPage;
  let editor;
  let fixture: ComponentFixture<ExercisesPage>;

  beforeEach(async(() => {
    editor = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      declarations: [ExercisesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthenticationService, useFactory: createAuthenticationServiceMock },
        { provide: ModalController, useFactory: () => createOverlayControllerMock('ModalController', editor) }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add', () => {
    it('creates a modal editor', () => {
      const modalController = TestBed.get(ModalController);
      component.add();
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({ component: ExerciseEditorComponent });
    });

    it('presents the editor', async () => {
      const modalController = TestBed.get(ModalController);
      await component.add();
      expect(editor.present).toHaveBeenCalledTimes(1);
    });
  });
});
