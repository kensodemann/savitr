import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/services';
import { NavController } from '@ionic/angular';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { Observable } from 'rxjs';
import { WorkoutLog } from '@app/models';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss']
})
export class HistoryPage implements OnInit {
  logs$: Observable<Array<WorkoutLog>>;

  constructor(
    public authentication: AuthenticationService,
    private navController: NavController,
    private workoutLogs: WeeklyWorkoutLogsService
  ) {}

  ngOnInit() {
    this.logs$ = this.workoutLogs.all();
  }

  add() {
    this.navController.navigateForward(['workout-plan']);
  }
}
