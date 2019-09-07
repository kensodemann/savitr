import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExerciseFinderComponent } from '@app/shared/exercise-finder/exercise-finder.component';
import { Exercise, WorkoutLog, WorkoutLogEntry } from '@app/models';

@Component({
  selector: 'app-log-entry-editor',
  templateUrl: './log-entry-editor.component.html',
  styleUrls: ['./log-entry-editor.component.scss']
})
export class LogEntryEditorComponent implements OnInit {
  title: string;
  errorMessage: string;
  warningMessage: string;

  exercise: Exercise;
  sets: number;
  reps: number;
  time: string;
  weight: number;

  @Input() logDate: Date;
  @Input() workoutLog: WorkoutLog;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.title = 'Add Exercise';
  }

  async findExercise() {
    const modal = await this.modalController.create({ component: ExerciseFinderComponent });
    modal.present();
    const res = await modal.onDidDismiss();
    if (res.role === 'select') {
      this.exercise = res.data;
    }
  }

  close() {
    this.modalController.dismiss();
  }

  get canSave(): boolean {
    return !!(this.exercise && (this.time || (this.sets && this.reps)));
  }

  save() {
    const entry: WorkoutLogEntry = {
      workoutLog: this.workoutLog,
      logDate: this.logDate,
      exercise: this.exercise,
      completed: false
    };
    if (this.time) {
      entry.time = this.time;
    }
    if (this.sets) {
      entry.sets = this.sets;
    }
    if (this.reps) {
      entry.reps = this.reps;
    }
    if (this.weight) {
      entry.weight = this.weight;
    }
    this.modalController.dismiss(entry , 'save');
  }
}
