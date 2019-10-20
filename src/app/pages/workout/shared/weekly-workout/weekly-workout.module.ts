import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeeklyWorkoutComponent } from './weekly-workout.component';
import { DayHeaderComponentModule } from '@app/pages/workout/shared/day-header/day-header.module';
import { WorkoutLogEntryListItemComponentModule } from '@app/shared';

@NgModule({
  imports: [CommonModule, DayHeaderComponentModule, FormsModule, IonicModule, WorkoutLogEntryListItemComponentModule],
  declarations: [WeeklyWorkoutComponent],
  entryComponents: [WeeklyWorkoutComponent],
  exports: [WeeklyWorkoutComponent]
})
export class WeeklyWorkoutComponentModule {}
