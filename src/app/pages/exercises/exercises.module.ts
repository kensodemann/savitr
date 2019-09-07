import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExercisesPage } from './exercises.page';
import { ExerciseEditorComponentModule } from '@app/editors';
import { ExerciseListComponentModule } from '@app/shared';
import { AuthGuardService } from '@app/services';

const routes: Routes = [
  {
    canActivate: [AuthGuardService],
    path: '',
    component: ExercisesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ExerciseEditorComponentModule,
    ExerciseListComponentModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExercisesPage]
})
export class ExercisesPageModule {}
