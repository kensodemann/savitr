import { Injectable } from '@angular/core';
import { WorkoutModule } from '@app/pages/workout/workout.module';
import { ModalController, AlertController } from '@ionic/angular';
import { getDay } from 'date-fns';

import { WorkoutLog, WorkoutLogEntry } from '@app/models';
import { LogEntryEditorComponent } from '@app/editors';
import { WorkoutLogEntriesService } from '@app/services/firestore-data';
import { yesNoButtons } from '@app/util';

@Injectable({
  providedIn: WorkoutModule
})
export class WorkoutPageService {
  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private workoutLogEntries: WorkoutLogEntriesService
  ) {}

  async add(workoutLog: WorkoutLog, logDate: Date): Promise<boolean> {
    const modal = await this.modalController.create({
      component: LogEntryEditorComponent,
      componentProps: { logDate, workoutLog }
    });
    modal.present();
    const res = await modal.onDidDismiss();
    if (res && res.role === 'save') {
      await this.workoutLogEntries.add(res.data);
      return true;
    }
    return false;
  }

  async delete(workoutLogEntry: WorkoutLogEntry): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'Remove Entry?',
      message: 'Are you sure you would like to remove this exercise from the workout log?',
      buttons: yesNoButtons
    });
    alert.present();
    const res = await alert.onDidDismiss();
    if (res.role === 'confirm') {
      await this.workoutLogEntries.delete(workoutLogEntry);
      return true;
    }
    return false;
  }

  async edit(workoutLogEntry: WorkoutLogEntry): Promise<boolean> {
    const modal = await this.modalController.create({
      component: LogEntryEditorComponent,
      componentProps: { workoutLogEntry }
    });
    modal.present();
    const res = await modal.onDidDismiss();
    if (res && res.role === 'save') {
      await this.workoutLogEntries.update(res.data);
      return true;
    }
    return false;
  }

  async logEntries(workoutLog?: WorkoutLog): Promise<Array<Array<WorkoutLogEntry>>> {
    const exerciseLogs: Array<Array<WorkoutLogEntry>> = [[], [], [], [], [], [], []];
    if (workoutLog) {
      const logs = await this.workoutLogEntries.getAllForLog(workoutLog.id);
      logs.forEach(log => {
        const day = getDay(log.logDate);
        exerciseLogs[day].push(log);
      });
    }
    return exerciseLogs;
  }
}
