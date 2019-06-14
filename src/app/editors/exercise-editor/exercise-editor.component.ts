import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { exerciseFocusAreas, exerciseTypes } from '../../default-data';
import { Exercise } from '../../models/exercise';
import { ExercisesService } from 'src/app/services/firestore-data/exercises/exercises.service';

@Component({
  selector: 'app-exercise-editor',
  templateUrl: './exercise-editor.component.html',
  styleUrls: ['./exercise-editor.component.scss']
})
export class ExerciseEditorComponent implements OnInit {
  title: string;

  area: string;
  name: string;
  description: string;
  type: string;

  exercise: Exercise;

  areas: Array<string>;
  types: Array<string>;

  errorMessage: string;
  warningMessage: string;

  constructor(
    private exercisesService: ExercisesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initializeTitle();
    this.initializeSelectionData();
    this.initializeEditorData();
  }

  close() {
    this.modalController.dismiss();
  }

  async save() {
    try {
      await this.saveExercise();
      this.modalController.dismiss();
    } catch (error) {
      this.errorMessage = `Error saving: ${error.message}`;
    }
  }

  private async saveExercise() {
    if (this.exercise) {
      await this.exercisesService.update(this.exerciseObject());
    } else {
      await this.exercisesService.add(this.exerciseObject());
    }
  }

  private exerciseObject(): Exercise {
    const e: Exercise = {
      name: this.name,
      description: this.description,
      area: this.area,
      type: this.type
    };

    if (this.exercise) {
      e.id = this.exercise.id;
    }

    return e;
  }

  private initializeEditorData() {
    this.name = this.exercise ? this.exercise.name : '';
    this.description = this.exercise ? this.exercise.description : '';
    this.area = this.exercise ? this.exercise.area : '';
    this.type = this.exercise ? this.exercise.type : '';
  }

  private initializeSelectionData() {
    this.areas = [...exerciseFocusAreas];
    this.types = [...exerciseTypes];
  }

  private initializeTitle() {
    this.title = this.exercise ? 'Update Exercise' : 'Add Exercise';
  }
}
