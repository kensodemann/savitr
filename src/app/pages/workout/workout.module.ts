import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '@app/services';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'current',
    pathMatch: 'full'
  },
  {
    canActivate: [AuthGuardService],
    path: 'current',
    loadChildren: () => import('./current/current.module').then(m => m.CurrentPageModule)
  },
  {
    canActivate: [AuthGuardService],
    path: 'history',
    loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule)
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class WorkoutModule {}
