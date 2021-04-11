import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WeeklyWorkoutComponent } from './weekly-workout.component';

describe('WeeklyWorkoutComponent', () => {
  let component: WeeklyWorkoutComponent;
  let fixture: ComponentFixture<WeeklyWorkoutComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WeeklyWorkoutComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyWorkoutComponent);
    component = fixture.componentInstance;
    component.exerciseLogs = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
