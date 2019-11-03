import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { parseISO } from 'date-fns';

import { TodayComponent } from './today.component';
import { WorkoutLogEntry } from '@app/models';

describe('TodayComponent', () => {
  let component: TodayComponent;
  let fixture: ComponentFixture<TodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TodayComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on toggled', () => {
    it('emits a toggled event with the updated log entry', fakeAsync(() => {
      let entry: WorkoutLogEntry;
      component.toggle.subscribe(e => (entry = e));
      component.onToggle(
        {
          id: 'ifiifiigifi',
          logDate: parseISO('2019-07-22'),
          workoutLog: { id: '715WI920', beginDate: parseISO('2019-10-27') },
          exercise: {
            id: 'iifgiifdie',
            name: 'Bench Press',
            description: 'Basic Press',
            type: 'Free Weight',
            area: 'Upper Body'
          },
          completed: false
        },
        true
      );
      tick();
      expect(entry).toEqual({
        id: 'ifiifiigifi',
        logDate: parseISO('2019-07-22'),
        workoutLog: { id: '715WI920', beginDate: parseISO('2019-10-27') },
        exercise: {
          id: 'iifgiifdie',
          name: 'Bench Press',
          description: 'Basic Press',
          type: 'Free Weight',
          area: 'Upper Body'
        },
        completed: true
      });
    }));
  });
});
