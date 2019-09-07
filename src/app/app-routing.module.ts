import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'current',
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'current',
    loadChildren: () =>
      import('./pages/current/current.module').then(m => m.CurrentPageModule)
  },
  {
    path: 'exercises',
    loadChildren: () =>
      import('./pages/exercises/exercises.module').then(
        m => m.ExercisesPageModule
      )
  },
  {
    path: 'history',
    loadChildren: () =>
      import('./pages/history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'workout-plan',
    loadChildren: () =>
      import('./pages/workout-plan/workout-plan.module').then(
        m => m.WorkoutPlanPageModule
      )
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
