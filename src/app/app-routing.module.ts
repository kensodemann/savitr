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
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'current',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/current/current.module').then(m => m.CurrentPageModule)
  },
  {
    path: 'exercises',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('./pages/exercises/exercises.module').then(m => m.ExercisesPageModule)
  },
  {
    path: 'history',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
