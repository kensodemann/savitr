import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThisWeekComponent } from './this-week.component';
import { DateService } from '@app/services';
import { createDateServiceMock } from '@app/services/mocks';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { createWeeklyWorkoutLogsServiceMock } from '@app/services/firestore-data/mocks';
import { parseISO } from 'date-fns';
import { WorkoutPageService } from '@app/pages/workout/services/workout-page/workout-page.service';
import { createWorkoutPageServiceMock } from '@app/pages/workout/services/workout-page/workout-page.service.mock';
import { WorkoutLog } from '@app/models';

describe('ThisWeekComponent', () => {
  let component: ThisWeekComponent;
  let fixture: ComponentFixture<ThisWeekComponent>;
  let log: WorkoutLog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThisWeekComponent],
      providers: [
        {
          provide: DateService,
          useFactory: createDateServiceMock
        },
        { provide: WeeklyWorkoutLogsService, useFactory: createWeeklyWorkoutLogsServiceMock },
        { provide: WorkoutPageService, useFactory: createWorkoutPageServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    log = { id: '715WI920', beginDate: parseISO('2019-10-27') };
    const dateService = TestBed.get(DateService);
    dateService.currentBeginDate.mockReturnValue(parseISO('2019-10-27'));
    const weeklyWorkoutLogs = TestBed.get(WeeklyWorkoutLogsService);
    weeklyWorkoutLogs.getForDate.mockResolvedValue(log);
    fixture = TestBed.createComponent(ThisWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
