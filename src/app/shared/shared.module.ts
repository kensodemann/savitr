import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExerciseListComponentModule } from '@app/shared/exercise-list/exercise-list.module';
import { ExerciseListItemComponentModule } from './exercise-list-item/exercise-list-item.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ExerciseListComponentModule, ExerciseListItemComponentModule]
})
export class SharedModule {}
