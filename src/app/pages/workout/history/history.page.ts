import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { WeeklyWorkoutLogsService } from '@app/services/firestore-data';
import { WorkoutLog } from '@app/models';
import { State } from '@app/store';
import { logout } from '@app/store/actions/auth.actions';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  logs$: Observable<Array<WorkoutLog>>;

  constructor(private store: Store<State>, private workoutLogs: WeeklyWorkoutLogsService) {}

  ngOnInit() {
    this.logs$ = this.workoutLogs.all();
  }

  logout() {
    this.store.dispatch(logout());
  }
}
