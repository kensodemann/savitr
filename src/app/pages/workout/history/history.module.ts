import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HistoryPage } from './history.page';
import { AuthGuardService } from '@app/services';

const routes: Routes = [
  {
    canActivate: [AuthGuardService],
    path: '',
    component: HistoryPage
  },
  {
    canActivate: [AuthGuardService],
    path: 'plan',
    loadChildren: () => import('./plan/plan.module').then(m => m.PlanPageModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HistoryPage]
})
export class HistoryPageModule {}
