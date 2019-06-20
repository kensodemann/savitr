import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExercisesPage } from './exercises.page';
import { EditorsModule } from 'src/app/editors/editors.module';
import { ExerciseListItemComponentModule } from 'src/app/shared/exercise-list-item/exercise-list-item.module';

const routes: Routes = [
  {
    path: '',
    component: ExercisesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    EditorsModule,
    ExerciseListItemComponentModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExercisesPage]
})
export class ExercisesPageModule {}
