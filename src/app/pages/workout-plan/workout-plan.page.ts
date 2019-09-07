import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { addDays } from 'date-fns';

import { DateService } from '@app/services';
import { LogEntryEditorComponent } from '@app/editors';
import { WeeklyWorkoutLogsService, WorkoutLogEntriesService } from '@app/services/firestore-data';
import { WorkoutLog } from '@app/models';

@Component({
  selector: 'app-workout-plan',
  templateUrl: './workout-plan.page.html',
  styleUrls: ['./workout-plan.page.scss']
})
export class WorkoutPlanPage implements OnInit {
  private currentWorkoutLog: WorkoutLog;

  beginMS: number;
  beginDates: Array<Date>;
  disableDateChange: boolean;

  constructor(
    private alertController: AlertController,
    private dates: DateService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private workoutLogs: WeeklyWorkoutLogsService,
    private workoutLogEntries: WorkoutLogEntriesService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.initWorkLog(id);
    } else {
      this.initNewWorkLog();
    }
  }

  async addExercise(offset: number) {
    if (!this.beginMS) {
      const alert = await this.alertController.create({
        header: 'No Date',
        message: 'Please select a begin date.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      const logDate = addDays(new Date(this.beginMS), offset);
      const modal = await this.modalController.create({
        component: LogEntryEditorComponent,
        componentProps: { logDate, workoutLog: this.currentWorkoutLog }
      });
      modal.present();
      const res = await modal.onDidDismiss();
      if (res && res.role === 'save') {
        this.workoutLogEntries.add(res.data);
      }
    }
  }

  async beginDateChanged() {
    this.currentWorkoutLog = await this.workoutLogs.getForDate(new Date(this.beginMS));
  }

  private async initWorkLog(id: string) {
    this.currentWorkoutLog = await this.workoutLogs.get(id);
    if (this.currentWorkoutLog) {
      this.beginMS = this.currentWorkoutLog.beginDate.getTime();
      this.disableDateChange = true;
      this.beginDates = [this.currentWorkoutLog.beginDate];
    }
  }

  private initNewWorkLog() {
    this.beginDates = this.dates.beginDates();
  }
}
