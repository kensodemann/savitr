import { Component, EventEmitter, Input, Output } from '@angular/core';

import { byName } from '@app/util';
import { Exercise } from '@app/models';
import { exerciseFocusAreas } from '@app/default-data';

interface AreaExercises {
  area: string;
  exercises: Array<Exercise>;
}

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss']
})
export class ExerciseListComponent {
  @Input() editable: boolean;
  @Input() set exercises(data: Array<Exercise>) {
    this.processExercises(data);
  }

  @Output() delete: EventEmitter<Exercise>;
  @Output() edit: EventEmitter<Exercise>;
  @Output() view: EventEmitter<Exercise>;

  exercisesByArea: Array<AreaExercises>;

  constructor() {
    this.delete = new EventEmitter();
    this.edit = new EventEmitter();
    this.view = new EventEmitter();
  }

  private processExercises(all: Array<Exercise>) {
    this.exercisesByArea = [];
    if (all) {
      exerciseFocusAreas.forEach(area => this.exercisesByArea.push(this.exercisesForArea(all, area)));
    }
  }

  private exercisesForArea(all: Array<Exercise>, area: string): AreaExercises {
    return {
      area,
      exercises: all.filter(e => e.area === area).sort(byName)
    };
  }
}
