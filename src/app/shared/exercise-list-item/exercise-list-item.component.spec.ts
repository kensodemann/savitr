import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseListItemComponent } from './exercise-list-item.component';

describe('ExerciseListItemComponent', () => {
  let component: ExerciseListItemComponent;
  let fixture: ComponentFixture<ExerciseListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciseListItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseListItemComponent);
    component = fixture.componentInstance;
    component.exercise = {
      name: 'sit-up',
      description: 'lay on your back, sit up, crunching in the middle',
      type: 'Body Weight',
      area: 'Core'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
