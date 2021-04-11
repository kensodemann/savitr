import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WorkoutLogEntry } from '@app/models';

@Component({
  selector: 'app-workout-log-entry-list-item',
  templateUrl: './workout-log-entry-list-item.component.html',
  styleUrls: ['./workout-log-entry-list-item.component.scss'],
})
export class WorkoutLogEntryListItemComponent implements OnInit {
  @Input() workoutLogEntry: WorkoutLogEntry;
  @Input() showCompletion: boolean;

  completed: boolean;

  @Output() delete: EventEmitter<WorkoutLogEntry>;
  @Output() edit: EventEmitter<WorkoutLogEntry>;
  @Output() toggle: EventEmitter<boolean>;

  constructor() {
    this.delete = new EventEmitter();
    this.edit = new EventEmitter();
    this.toggle = new EventEmitter();
  }

  ngOnInit() {
    this.completed = this.workoutLogEntry.completed;
  }

  toggleCompletion() {
    this.toggle.emit(this.completed);
  }
}
