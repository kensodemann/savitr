import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'current',
    pathMatch: 'full'
  },
  {
    path: 'about',
    canActivate: [AuthGuardService],
    loadChildren: './pages/about/about.module#AboutPageModule'
  },
  {
    path: 'current',
    canActivate: [AuthGuardService],
    loadChildren: './pages/current/current.module#CurrentPageModule'
  },
  {
    path: 'exercises',
    canActivate: [AuthGuardService],
    loadChildren: './pages/exercises/exercises.module#ExercisesPageModule'
  },
  {
    path: 'history',
    canActivate: [AuthGuardService],
    loadChildren: './pages/history/history.module#HistoryPageModule'
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
