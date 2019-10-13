import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DayHeaderComponent } from './day-header.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [DayHeaderComponent],
  entryComponents: [DayHeaderComponent],
  exports: [DayHeaderComponent]
})
export class DayHeaderComponentModule {}
