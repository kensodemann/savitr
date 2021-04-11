import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseFinderComponent } from './exercise-finder.component';
import { ExerciseListComponentModule } from '../exercise-list/exercise-list.module';

@NgModule({
  imports: [CommonModule, ExerciseListComponentModule, FormsModule, IonicModule],
  declarations: [ExerciseFinderComponent],
  entryComponents: [ExerciseFinderComponent],
  exports: [ExerciseFinderComponent],
})
export class ExerciseFinderComponentModule {}
