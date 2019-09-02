import { Component, OnInit } from '@angular/core';
import { DateService } from '@app/services';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { WorkoutLog } from '@app/models';

@Component({
  selector: 'app-workout-plan',
  templateUrl: './workout-plan.page.html',
  styleUrls: ['./workout-plan.page.scss']
})
export class WorkoutPlanPage implements OnInit {
  private currentWorkLog: WorkoutLog;

  beginDate: Date;
  beginDates: Array<Date>;

  constructor(private dates: DateService, private workoutLogs: WeeklyWorkoutLogsService) {}

  ngOnInit() {
    this.beginDates = this.dates.beginDates();
  }

  addExercise(offset: number) {
    console.log('you clicked the header', offset);
  }

  async beginDateChanged() {
    this.currentWorkLog = await this.workoutLogs.getForDate(this.beginDate);
  }
}
