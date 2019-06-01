import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesPage } from './exercises.page';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { createAuthenticationServiceMock } from '../../services/authentication/authentication.mock';

describe('ExercisesPage', () => {
  let component: ExercisesPage;
  let fixture: ComponentFixture<ExercisesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExercisesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AuthenticationService,
          useFactory: createAuthenticationServiceMock
        }
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
});
