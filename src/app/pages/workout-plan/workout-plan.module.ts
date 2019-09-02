import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WorkoutPlanPage } from './workout-plan.page';
import { DayHeaderComponent } from './day-header/day-header.component';

const routes: Routes = [
  {
    path: '',
    component: WorkoutPlanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WorkoutPlanPage, DayHeaderComponent]
})
export class WorkoutPlanPageModule {}
