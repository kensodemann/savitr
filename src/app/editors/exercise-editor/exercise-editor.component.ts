import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { exerciseFocusAreas, exerciseTypes } from '@app/default-data';
import { Exercise } from '@app/models';

@Component({
  selector: 'app-exercise-editor',
  templateUrl: './exercise-editor.component.html',
  styleUrls: ['./exercise-editor.component.scss'],
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

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.initializeTitle();
    this.initializeSelectionData();
    this.initializeEditorData();
  }

  close() {
    this.modalController.dismiss();
  }

  async save() {
    this.modalController.dismiss(this.exerciseObject(), 'save');
  }

  private exerciseObject(): Exercise {
    const e: Exercise = {
      name: this.name,
      description: this.description,
      area: this.area,
      type: this.type,
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
