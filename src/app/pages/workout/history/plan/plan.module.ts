import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthGuardService } from '@app/services';
import { PlanPage } from './plan.page';
import { WorkoutLogEntryListItemComponentModule } from '@app/shared';
import { DayHeaderComponentModule } from '@app/pages/workout/shared/day-header/day-header.module';

const routes: Routes = [
  {
    canActivate: [AuthGuardService],
    path: '',
    component: PlanPage
  },
  {
    canActivate: [AuthGuardService],
    path: ':id',
    component: PlanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    DayHeaderComponentModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    WorkoutLogEntryListItemComponentModule
  ],
  declarations: [PlanPage]
})
export class PlanPageModule {}
