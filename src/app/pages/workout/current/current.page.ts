import { Component, OnInit } from '@angular/core';
import { WorkoutLog, WorkoutLogEntry } from '@app/models';
import { WorkoutPageService } from '@app/pages/workout/services/workout-page/workout-page.service';
import { DateService } from '@app/services';
import { WeeklyWorkoutLogsService, WorkoutLogEntriesService } from '@app/services/firestore-data';
import { State } from '@app/store';
import { logout } from '@app/store/actions/auth.actions';
import { Store } from '@ngrx/store';
import { addDays } from 'date-fns';

@Component({
  selector: 'app-current',
  templateUrl: './current.page.html',
  styleUrls: ['./current.page.scss'],
})
export class CurrentPage implements OnInit {
  currentView: string;
  day: number;
  logEntries: Array<Array<WorkoutLogEntry>>;

  private log: WorkoutLog;

  constructor(
    private dateService: DateService,
    private store: Store<State>,
    private weeklyWorkoutLogs: WeeklyWorkoutLogsService,
    private workoutLogEntries: WorkoutLogEntriesService,
    private workoutPageService: WorkoutPageService
  ) {
    this.logEntries = [[], [], [], [], [], [], []];
  }

  async ngOnInit() {
    this.currentView = 'today';
    this.day = this.dateService.currentDay();
    const dt = this.dateService.currentBeginDate();
    this.log = await this.weeklyWorkoutLogs.getForDate(dt);
    this.logEntries = await this.workoutPageService.logEntries(this.log);
  }

  async add(offset: number): Promise<void> {
    if (await this.workoutPageService.add(this.log, addDays(this.log.beginDate, offset))) {
      this.logEntries = await this.workoutPageService.logEntries(this.log);
    }
  }

  async edit(entry: WorkoutLogEntry): Promise<void> {
    if (await this.workoutPageService.edit(entry)) {
      this.logEntries = await this.workoutPageService.logEntries(this.log);
    }
  }

  async delete(entry: WorkoutLogEntry): Promise<void> {
    if (await this.workoutPageService.delete(entry)) {
      this.logEntries = await this.workoutPageService.logEntries(this.log);
    }
  }

  save(entry: WorkoutLogEntry): void {
    this.workoutLogEntries.update(entry);
  }

  logout() {
    this.store.dispatch(logout());
  }
}
