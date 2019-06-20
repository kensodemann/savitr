import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExerciseListItemComponentModule } from './exercise-list-item/exercise-list-item.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ExerciseListItemComponentModule]
})
export class SharedModule {}
