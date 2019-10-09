import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { addDays, getDay } from 'date-fns';

import { DateService } from '@app/services';
import { LogEntryEditorComponent } from '@app/editors';
import { WeeklyWorkoutLogsService, WorkoutLogEntriesService } from '@app/services/firestore-data';
import { WorkoutLog, WorkoutLogEntry, Exercise } from '@app/models';
import { yesNoButtons } from '@app/util';

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
  exerciseLogs: Array<Array<WorkoutLogEntry>>;

  constructor(
    private alertController: AlertController,
    private dates: DateService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private workoutLogs: WeeklyWorkoutLogsService,
    private workoutLogEntries: WorkoutLogEntriesService
  ) {}

  async ngOnInit() {
    this.initDates();
    this.initExerciseLogs();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.getWorkLog(id);
    }
  }

  async addExercise(offset: number) {
    if (!this.beginMS) {
      this.alertNoDate();
    } else {
      const logDate = addDays(new Date(this.beginMS), offset);
      await this.addNewExercise(logDate);
    }
  }

  async delete(logEntry: WorkoutLogEntry) {
    const alert = await this.alertController.create({
      header: 'Remove Entry?',
      message: 'Are you sure you would like to remove this exercise from the workout log?',
      buttons: yesNoButtons
    });
    alert.present();
    const res = await alert.onDidDismiss();
    if (res.role === 'confirm') {
      await this.workoutLogEntries.delete(logEntry);
      await this.getWorkoutLogEntries();
    }
  }

  async beginDateChanged() {
    this.currentWorkoutLog = await this.workoutLogs.getForDate(new Date(this.beginMS));
    if (this.currentWorkoutLog) {
      await this.getWorkoutLogEntries();
    }
  }

  private async addNewExercise(logDate: Date) {
    const modal = await this.modalController.create({
      component: LogEntryEditorComponent,
      componentProps: { logDate, workoutLog: this.currentWorkoutLog }
    });
    modal.present();
    const res = await modal.onDidDismiss();
    if (res && res.role === 'save') {
      await this.workoutLogEntries.add(res.data);
      await this.getWorkoutLogEntries();
    }
  }

  private async alertNoDate() {
    const alert = await this.alertController.create({
      header: 'No Date',
      message: 'Please select a begin date.',
      buttons: ['OK']
    });
    alert.present();
  }

  private initExerciseLogs() {
    this.exerciseLogs = [[], [], [], [], [], [], []];
  }

  private initDates() {
    this.beginDates = this.dates.beginDates();
  }

  private async getWorkLog(id: string) {
    this.currentWorkoutLog = await this.workoutLogs.get(id);
    if (this.currentWorkoutLog) {
      this.beginMS = this.currentWorkoutLog.beginDate.getTime();
      this.disableDateChange = true;
      this.beginDates = [this.currentWorkoutLog.beginDate];
    }
  }

  private async getWorkoutLogEntries() {
    const logs = await this.workoutLogEntries.getAllForLog(this.currentWorkoutLog.id);
    this.initExerciseLogs();
    logs.forEach(log => {
      const day = getDay(log.logDate);
      this.exerciseLogs[day].push(log);
    });
  }
}
