import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseListComponent } from './exercise-list.component';
import { ExerciseListItemComponentModule } from '../exercise-list-item/exercise-list-item.module';

@NgModule({
  imports: [CommonModule, ExerciseListItemComponentModule, FormsModule, IonicModule],
  declarations: [ExerciseListComponent],
  entryComponents: [ExerciseListComponent],
  exports: [ExerciseListComponent]
})
export class ExerciseListComponentModule {}
