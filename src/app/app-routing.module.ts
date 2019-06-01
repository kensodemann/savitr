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
    loadChildren: './about/about.module#AboutPageModule'
  },
  {
    path: 'current',
    canActivate: [AuthGuardService],
    loadChildren: './current/current.module#CurrentPageModule'
  },
  {
    path: 'exercises',
    canActivate: [AuthGuardService],
    loadChildren: './exercises/exercises.module#ExercisesPageModule'
  },
  {
    path: 'history',
    canActivate: [AuthGuardService],
    loadChildren: './history/history.module#HistoryPageModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
