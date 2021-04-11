import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoWorkoutComponent } from './no-workout.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [NoWorkoutComponent],
  entryComponents: [NoWorkoutComponent],
  exports: [NoWorkoutComponent],
})
export class NoWorkoutComponentModule {}
