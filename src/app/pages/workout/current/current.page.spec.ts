import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WorkoutLog } from '@app/models';
import { WorkoutPageService } from '@app/pages/workout/services/workout-page/workout-page.service';
import { createWorkoutPageServiceMock } from '@app/pages/workout/services/workout-page/workout-page.service.mock';
import { DateService } from '@app/services';
import { WeeklyWorkoutLogsService, WorkoutLogEntriesService } from '@app/services/firestore-data';
import {
  createWeeklyWorkoutLogsServiceMock,
  createWorkoutLogEntriesServiceMock,
} from '@app/services/firestore-data/mocks';
import { createDateServiceMock } from '@app/services/mocks';
import { logout } from '@app/store/actions/auth.actions';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { parseISO } from 'date-fns';
import { CurrentPage } from './current.page';

describe('CurrentPage', () => {
  let component: CurrentPage;
  let fixture: ComponentFixture<CurrentPage>;
  let log: WorkoutLog;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CurrentPage],
        providers: [
          {
            provide: DateService,
            useFactory: createDateServiceMock,
          },
          { provide: WeeklyWorkoutLogsService, useFactory: createWeeklyWorkoutLogsServiceMock },
          { provide: WorkoutLogEntriesService, useFactory: createWorkoutLogEntriesServiceMock },
          { provide: WorkoutPageService, useFactory: createWorkoutPageServiceMock },
          provideMockStore(),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    log = { id: '715WI920', beginDate: parseISO('2019-10-27') };
    const dateService = TestBed.inject(DateService);
    (dateService.currentBeginDate as any).mockReturnValue(parseISO('2019-10-27'));
    (dateService.currentDay as any).mockReturnValue(4);
    const weeklyWorkoutLogs = TestBed.inject(WeeklyWorkoutLogsService);
    (weeklyWorkoutLogs.getForDate as any).mockResolvedValue(log);
    fixture = TestBed.createComponent(CurrentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('gets the day of the week', () => {
    const dateService = TestBed.inject(DateService);
    expect(dateService.currentDay).toHaveBeenCalledTimes(1);
    expect(component.day).toEqual(4);
  });

  it('gets the current end date', () => {
    const dateService = TestBed.inject(DateService);
    expect(dateService.currentBeginDate).toHaveBeenCalledTimes(1);
  });

  it('gets the log for that end date', () => {
    const weeklyWorkoutLogs = TestBed.inject(WeeklyWorkoutLogsService);
    expect(weeklyWorkoutLogs.getForDate).toHaveBeenCalledTimes(1);
    expect(weeklyWorkoutLogs.getForDate).toHaveBeenCalledWith(parseISO('2019-10-27'));
  });

  it('gets the entries for the log', () => {
    const workoutPageService = TestBed.inject(WorkoutPageService);
    expect(workoutPageService.logEntries).toHaveBeenCalledTimes(1);
    expect(workoutPageService.logEntries).toHaveBeenCalledWith(log);
  });

  describe('CRUD operation', () => {
    let workoutPageService;
    let entry;
    beforeEach(() => {
      workoutPageService = TestBed.inject(WorkoutPageService);
      workoutPageService.logEntries.mockClear();
      entry = {
        id: 'ifiifiigifi',
        logDate: parseISO('2019-07-22'),
        workoutLog: log,
        exercise: {
          id: 'iifgiifdie',
          name: 'Bench Press',
          description: 'Basic Press',
          type: 'Free Weight',
          area: 'Upper Body',
        },
        completed: false,
      };
    });

    describe('add', () => {
      it('calls the page service add', async () => {
        await component.add(3);
        expect(workoutPageService.add).toHaveBeenCalledTimes(1);
        expect(workoutPageService.add).toHaveBeenCalledWith(log, parseISO('2019-10-30'));
      });

      it('refreshes the data if the add occurs', async () => {
        workoutPageService.add.mockResolvedValue(true);
        await component.add(3);
        expect(workoutPageService.logEntries).toHaveBeenCalledTimes(1);
        expect(workoutPageService.logEntries).toHaveBeenCalledWith(log);
      });

      it('does not refresh the data if the add did not happen', async () => {
        workoutPageService.add.mockResolvedValue(false);
        await component.add(3);
        expect(workoutPageService.logEntries).not.toHaveBeenCalled();
      });
    });

    describe('edit', () => {
      it('calls the page service edit', async () => {
        await component.edit(entry);
        expect(workoutPageService.edit).toHaveBeenCalledTimes(1);
        expect(workoutPageService.edit).toHaveBeenCalledWith(entry);
      });

      it('refreshes the data if the edit occured', async () => {
        workoutPageService.edit.mockResolvedValue(true);
        await component.edit(entry);
        expect(workoutPageService.logEntries).toHaveBeenCalledTimes(1);
        expect(workoutPageService.logEntries).toHaveBeenCalledWith(log);
      });

      it('does not refresh the data if the edit did not occur', async () => {
        workoutPageService.add.mockResolvedValue(false);
        await component.edit(entry);
        expect(workoutPageService.logEntries).not.toHaveBeenCalled();
      });
    });

    describe('delete', () => {
      it('calls the page service delete', async () => {
        await component.delete(entry);
        expect(workoutPageService.delete).toHaveBeenCalledTimes(1);
        expect(workoutPageService.delete).toHaveBeenCalledWith(entry);
      });

      it('refreshes the data if the edit occured', async () => {
        workoutPageService.delete.mockResolvedValue(true);
        await component.delete(entry);
        expect(workoutPageService.logEntries).toHaveBeenCalledTimes(1);
        expect(workoutPageService.logEntries).toHaveBeenCalledWith(log);
      });

      it('does not refresh the data if the edit did not occur', async () => {
        workoutPageService.delete.mockResolvedValue(false);
        await component.delete(entry);
        expect(workoutPageService.logEntries).not.toHaveBeenCalled();
      });
    });
  });

  describe('save', () => {
    it('saves the passed in log entry', () => {
      const workoutLogEntries = TestBed.inject(WorkoutLogEntriesService);
      component.save({
        id: 'ifiifiigifi',
        logDate: parseISO('2019-07-22'),
        workoutLog: log,
        exercise: {
          id: 'iifgiifdie',
          name: 'Bench Press',
          description: 'Basic Press',
          type: 'Free Weight',
          area: 'Upper Body',
        },
        completed: true,
      });
      expect(workoutLogEntries.update).toHaveBeenCalledTimes(1);
      expect(workoutLogEntries.update).toHaveBeenCalledWith({
        id: 'ifiifiigifi',
        logDate: parseISO('2019-07-22'),
        workoutLog: log,
        exercise: {
          id: 'iifgiifdie',
          name: 'Bench Press',
          description: 'Basic Press',
          type: 'Free Weight',
          area: 'Upper Body',
        },
        completed: true,
      });
    });
  });

  describe('logout', () => {
    it('dispatches the logout action', () => {
      const store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      component.logout();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
  });
});
