import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogEntryEditorComponent } from './log-entry-editor.component';
import { ExerciseFinderComponentModule } from '@app/shared';
import { ExerciseListItemComponentModule } from '@app/shared';

@NgModule({
  imports: [CommonModule, ExerciseFinderComponentModule, ExerciseListItemComponentModule, FormsModule, IonicModule],
  declarations: [LogEntryEditorComponent],
  entryComponents: [LogEntryEditorComponent],
  exports: [LogEntryEditorComponent],
})
export class LogEntryEditorComponentModule {}
