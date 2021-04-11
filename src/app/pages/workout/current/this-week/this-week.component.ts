import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WorkoutLogEntry } from '@app/models';

@Component({
  selector: 'app-this-week',
  templateUrl: './this-week.component.html',
  styleUrls: ['./this-week.component.scss'],
})
export class ThisWeekComponent {
  @Input() logEntries: Array<Array<WorkoutLogEntry>>;
  @Output() add: EventEmitter<number>;
  @Output() edit: EventEmitter<WorkoutLogEntry>;
  @Output() delete: EventEmitter<WorkoutLogEntry>;

  constructor() {
    this.add = new EventEmitter();
    this.edit = new EventEmitter();
    this.delete = new EventEmitter();
  }
}
