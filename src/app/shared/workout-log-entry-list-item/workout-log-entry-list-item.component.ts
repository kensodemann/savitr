import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WorkoutLogEntry } from '@app/models';

@Component({
  selector: 'app-workout-log-entry-list-item',
  templateUrl: './workout-log-entry-list-item.component.html',
  styleUrls: ['./workout-log-entry-list-item.component.scss'],
})
export class WorkoutLogEntryListItemComponent implements OnInit {
  @Input() workoutLogEntry: WorkoutLogEntry;

  @Output() delete: EventEmitter<void>;
  @Output() edit: EventEmitter<void>;
  @Output() view: EventEmitter<void>;

  constructor() {
    this.delete = new EventEmitter();
    this.edit = new EventEmitter();
    this.view = new EventEmitter();
  }

  ngOnInit() {}
}
