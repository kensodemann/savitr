import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { addDays } from 'date-fns';

import { DateService } from '@app/services';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { WorkoutLog, WorkoutLogEntry } from '@app/models';
import { WorkoutPageService } from '@app/pages/workout/services/workout-page/workout-page.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss']
})
export class PlanPage implements OnInit {
  private currentWorkoutLog: WorkoutLog;

  beginMS: number;
  beginDates: Array<Date>;
  disableDateChange: boolean;
  exerciseLogs: Array<Array<WorkoutLogEntry>>;

  constructor(
    private alertController: AlertController,
    private dates: DateService,
    private route: ActivatedRoute,
    private workoutLogs: WeeklyWorkoutLogsService,
    private workoutPageActions: WorkoutPageService
  ) {}

  async ngOnInit() {
    this.beginDates = this.dates.beginDates();
    this.exerciseLogs = [[], [], [], [], [], [], []];
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.getWorkLog(id);
    }
  }

  async add(offset: number) {
    if (!this.beginMS) {
      this.alertNoDate();
    } else {
      const logDate = addDays(new Date(this.beginMS), offset);
      if (await this.workoutPageActions.add(this.currentWorkoutLog, logDate)) {
        this.exerciseLogs = await this.workoutPageActions.logEntries(this.currentWorkoutLog);
      }
    }
  }

  async delete(workoutLogEntry: WorkoutLogEntry) {
    if (await this.workoutPageActions.delete(workoutLogEntry)) {
      this.exerciseLogs = await this.workoutPageActions.logEntries(this.currentWorkoutLog);
    }
  }

  async edit(workoutLogEntry: WorkoutLogEntry) {
    if (await this.workoutPageActions.edit(workoutLogEntry)) {
      this.exerciseLogs = await this.workoutPageActions.logEntries(this.currentWorkoutLog);
    }
  }

  async beginDateChanged() {
    this.currentWorkoutLog = await this.workoutLogs.getForDate(new Date(this.beginMS));
    this.exerciseLogs = await this.workoutPageActions.logEntries(this.currentWorkoutLog);
  }

  private async alertNoDate() {
    const alert = await this.alertController.create({
      header: 'No Date',
      message: 'Please select a begin date.',
      buttons: ['OK']
    });
    alert.present();
  }

  private async getWorkLog(id: string) {
    this.currentWorkoutLog = await this.workoutLogs.get(id);
    if (this.currentWorkoutLog) {
      this.beginMS = this.currentWorkoutLog.beginDate.getTime();
      this.disableDateChange = true;
      this.beginDates = [this.currentWorkoutLog.beginDate];
    }
  }
}
