import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkoutLog } from '@app/models';

@Component({
  selector: 'app-weekly-workout',
  templateUrl: './weekly-workout.component.html',
  styleUrls: ['./weekly-workout.component.scss']
})
export class WeeklyWorkoutComponent {
  @Input() exerciseLogs: Array<Array<WorkoutLog>>;
  @Output() add: EventEmitter<number>;
  @Output() edit: EventEmitter<WorkoutLog>;
  @Output() delete: EventEmitter<WorkoutLog>;

  constructor() {
    this.add = new EventEmitter();
    this.edit = new EventEmitter();
    this.delete = new EventEmitter();
  }
}
