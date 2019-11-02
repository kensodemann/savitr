import { Component, OnInit } from '@angular/core';
import { addDays } from 'date-fns';

import { DateService } from '@app/services';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { WorkoutLog, WorkoutLogEntry } from '@app/models';
import { WorkoutPageService } from '@app/pages/workout/services/workout-page/workout-page.service';

@Component({
  selector: 'app-this-week',
  templateUrl: './this-week.component.html',
  styleUrls: ['./this-week.component.scss']
})
export class ThisWeekComponent implements OnInit {
  private log: WorkoutLog;
  logEntries: Array<Array<WorkoutLogEntry>>;

  constructor(
    private dateService: DateService,
    private weeklyWorkoutLogs: WeeklyWorkoutLogsService,
    private workoutPageService: WorkoutPageService
  ) {
    this.logEntries = [[], [], [], [], [], [], []];
  }

  async ngOnInit() {
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
}
