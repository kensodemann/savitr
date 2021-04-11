import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkoutLogEntry } from '@app/models';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
})
export class TodayComponent {
  @Input() logEntries: Array<WorkoutLogEntry>;
  @Input() day: number;
  @Output() add: EventEmitter<number>;
  @Output() edit: EventEmitter<WorkoutLogEntry>;
  @Output() delete: EventEmitter<WorkoutLogEntry>;
  @Output() toggle: EventEmitter<WorkoutLogEntry>;

  constructor() {
    this.add = new EventEmitter();
    this.edit = new EventEmitter();
    this.delete = new EventEmitter();
    this.toggle = new EventEmitter();
  }

  onToggle(entry: WorkoutLogEntry, completed: boolean) {
    this.toggle.emit({ ...entry, completed });
  }
}
