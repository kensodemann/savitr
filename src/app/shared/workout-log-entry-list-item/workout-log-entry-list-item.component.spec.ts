import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { parseISO } from 'date-fns';

import { WorkoutLogEntryListItemComponent } from './workout-log-entry-list-item.component';

describe('WorkoutLogEntryListItemComponent', () => {
  let component: WorkoutLogEntryListItemComponent;
  let fixture: ComponentFixture<WorkoutLogEntryListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkoutLogEntryListItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
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
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    [true, false].forEach(value => {
      it(`assigns the completed flag a value of ${value}`, () => {
        component.workoutLogEntry.completed = value;
        fixture.detectChanges();
        expect(component.completed).toEqual(value);
      });
    });
  });

  describe('toggling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    [true, false].forEach(value => {
      it(`emits the current completed flag value of ${value}`, done => {
        component.toggle.subscribe(x => {
          expect(x).toEqual(value);
          done();
        });
        component.completed = value;
        component.toggleCompletion();
      });
    });
  });
});
