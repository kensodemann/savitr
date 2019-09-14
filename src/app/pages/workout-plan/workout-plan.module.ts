import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthGuardService } from '@app/services';
import { DayHeaderComponent } from './day-header/day-header.component';
import { LogEntryEditorComponentModule } from '@app/editors';
import { WorkoutPlanPage } from './workout-plan.page';
import { WorkoutLogEntryListItemComponentModule } from '@app/shared';

const routes: Routes = [
  {
    canActivate: [AuthGuardService],
    path: '',
    component: WorkoutPlanPage
  },
  {
    canActivate: [AuthGuardService],
    path: ':id',
    component: WorkoutPlanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    LogEntryEditorComponentModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    WorkoutLogEntryListItemComponentModule
  ],
  declarations: [WorkoutPlanPage, DayHeaderComponent]
})
export class WorkoutPlanPageModule {}
