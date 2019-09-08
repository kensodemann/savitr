import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExercisesPage } from './exercises.page';
import { EditorsModule } from '@app/editors/editors.module';
import { ExerciseListComponentModule } from '@app/shared/exercise-list/exercise-list.module';
import { ExerciseListItemComponentModule } from '@app/shared/exercise-list-item/exercise-list-item.module';

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
    ExerciseListComponentModule,
    ExerciseListItemComponentModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExercisesPage]
})
export class ExercisesPageModule {}
