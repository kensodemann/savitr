import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Exercise } from 'src/app/models/exercise';

@Component({
  selector: 'app-exercise-list-item',
  templateUrl: './exercise-list-item.component.html',
  styleUrls: ['./exercise-list-item.component.scss']
})
export class ExerciseListItemComponent {
  @Input() exercise: Exercise;
  @Output() delete: EventEmitter<void>;
  @Output() edit: EventEmitter<void>;
  @Output() view: EventEmitter<void>;

  constructor() {
    this.delete = new EventEmitter();
    this.edit = new EventEmitter();
    this.view = new EventEmitter();
  }
}
