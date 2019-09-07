import { Component, OnInit } from '@angular/core';
import { DateService } from '@app/services';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { WorkoutLog } from '@app/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workout-plan',
  templateUrl: './workout-plan.page.html',
  styleUrls: ['./workout-plan.page.scss']
})
export class WorkoutPlanPage implements OnInit {
  private currentWorkLog: WorkoutLog;

  beginMS: number;
  beginDates: Array<Date>;
  disableDateChange: boolean;

  constructor(
    private dates: DateService,
    private route: ActivatedRoute,
    private workoutLogs: WeeklyWorkoutLogsService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.beginDates = this.dates.beginDates();
    if (id) {
      await this.initWorkLog(id);
    }
  }

  addExercise(offset: number) {
    // console.log('you clicked the header', offset);
  }

  async beginDateChanged() {
    this.currentWorkLog = await this.workoutLogs.getForDate(new Date(this.beginMS));
  }

  private async initWorkLog(id: string) {
    this.currentWorkLog = await this.workoutLogs.get(id);
    if (this.currentWorkLog) {
      this.beginMS = this.currentWorkLog.beginDate.getTime();
      this.disableDateChange = true;
    }
  }
}
