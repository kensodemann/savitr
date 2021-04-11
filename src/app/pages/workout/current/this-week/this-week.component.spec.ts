import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WorkoutLog } from '@app/models';
import { WorkoutPageService } from '@app/pages/workout/services/workout-page/workout-page.service';
import { createWorkoutPageServiceMock } from '@app/pages/workout/services/workout-page/workout-page.service.mock';
import { DateService } from '@app/services';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { createWeeklyWorkoutLogsServiceMock } from '@app/services/firestore-data/mocks';
import { createDateServiceMock } from '@app/services/mocks';
import { parseISO } from 'date-fns';
import { ThisWeekComponent } from './this-week.component';

describe('ThisWeekComponent', () => {
  let component: ThisWeekComponent;
  let fixture: ComponentFixture<ThisWeekComponent>;
  let log: WorkoutLog;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ThisWeekComponent],
        providers: [
          {
            provide: DateService,
            useFactory: createDateServiceMock,
          },
          { provide: WeeklyWorkoutLogsService, useFactory: createWeeklyWorkoutLogsServiceMock },
          { provide: WorkoutPageService, useFactory: createWorkoutPageServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    log = { id: '715WI920', beginDate: parseISO('2019-10-27') };
    const dateService = TestBed.inject(DateService);
    (dateService.currentBeginDate as any).mockReturnValue(parseISO('2019-10-27'));
    const weeklyWorkoutLogs = TestBed.inject(WeeklyWorkoutLogsService);
    (weeklyWorkoutLogs.getForDate as any).mockResolvedValue(log);
    fixture = TestBed.createComponent(ThisWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
