import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CurrentPage } from './current.page';
import { ThisWeekComponent } from './this-week/this-week.component';
import { TodayComponent } from './today/today.component';

import { AuthGuardService } from '@app/services';

import { NoWorkoutComponentModule, WorkoutLogEntryListItemComponentModule } from '@app/shared';
import { WeeklyWorkoutComponentModule } from '@app/pages/workout/shared/weekly-workout/weekly-workout.module';

const routes: Routes = [
  {
    canActivate: [AuthGuardService],
    path: '',
    component: CurrentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoWorkoutComponentModule,
    RouterModule.forChild(routes),
    WeeklyWorkoutComponentModule,
    WorkoutLogEntryListItemComponentModule
  ],
  declarations: [CurrentPage, ThisWeekComponent, TodayComponent]
})
export class CurrentPageModule {}
