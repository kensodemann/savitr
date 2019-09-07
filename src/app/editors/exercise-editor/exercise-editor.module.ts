import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseEditorComponent } from './exercise-editor.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ExerciseEditorComponent],
  entryComponents: [ExerciseEditorComponent],
  exports: [ExerciseEditorComponent]
})
export class ExerciseEditorComponentModule {}