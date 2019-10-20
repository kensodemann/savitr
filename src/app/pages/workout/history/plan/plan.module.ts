import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthGuardService } from '@app/services';
import { PlanPage } from './plan.page';
import { WeeklyWorkoutComponentModule } from '@app/pages/workout/shared/weekly-workout/weekly-workout.module';

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
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), WeeklyWorkoutComponentModule],
  declarations: [PlanPage]
})
export class PlanPageModule {}
