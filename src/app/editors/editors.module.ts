import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ExerciseEditorComponent } from './exercise-editor/exercise-editor.component';

@NgModule({
  declarations: [ExerciseEditorComponent],
  exports: [ExerciseEditorComponent],
  entryComponents: [ExerciseEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class EditorsModule { }
