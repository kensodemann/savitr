import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseListItemComponent } from './exercise-list-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ExerciseListItemComponent],
  entryComponents: [ExerciseListItemComponent],
  exports: [ExerciseListItemComponent],
})
export class ExerciseListItemComponentModule {}
