import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { parseISO } from 'date-fns';

import { WorkoutLogEntryListItemComponent } from './workout-log-entry-list-item.component';

describe('WorkoutLogEntryListItemComponent', () => {
  let component: WorkoutLogEntryListItemComponent;
  let fixture: ComponentFixture<WorkoutLogEntryListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkoutLogEntryListItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutLogEntryListItemComponent);
    component = fixture.componentInstance;
    component.workoutLogEntry = {
      id: '73',
      exercise: {
        id: '42',
        name: 'sit-up',
        description: 'lay on your back, sit up, crunching in the middle',
        type: 'Body Weight',
        area: 'Core'
      },
      workoutLog: {
        id: '314159',
        beginDate: parseISO('2019-07-21')
      },
      logDate: parseISO('2019-07-23'),
      completed: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
