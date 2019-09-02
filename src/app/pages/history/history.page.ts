import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/services';
import { NavController } from '@ionic/angular';
import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { Observable, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { WorkoutLog } from '@app/models';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss']
})
export class HistoryPage implements OnInit {
  logs$: Observable<Array<WorkoutLog>>;

  constructor(
    private afAuth: AngularFireAuth,
    public authentication: AuthenticationService,
    private navController: NavController,
    private workoutLogs: WeeklyWorkoutLogsService
  ) {}

  ngOnInit() {
    this.logs$ = this.afAuth.authState.pipe(
      flatMap(u => {
        if (u) {
          return this.workoutLogs.all();
        } else {
          return EMPTY;
        }
      })
    );
  }

  add() {
    this.navController.navigateForward(['workout-plan']);
  }
}
