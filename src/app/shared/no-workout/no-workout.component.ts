import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-workout',
  templateUrl: './no-workout.component.html',
  styleUrls: ['./no-workout.component.scss']
})
export class NoWorkoutComponent {
  @Input() timeframe: string;
}
