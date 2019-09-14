import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutLogEntryListItemComponent } from './workout-log-entry-list-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [WorkoutLogEntryListItemComponent],
  entryComponents: [WorkoutLogEntryListItemComponent],
  exports: [WorkoutLogEntryListItemComponent]
})
export class WorkoutLogEntryListItemComponentModule {}
