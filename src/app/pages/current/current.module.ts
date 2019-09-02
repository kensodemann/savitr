import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CurrentPage } from './current.page';
import { ThisWeekComponent } from './this-week/this-week.component';
import { TodayComponent } from './today/today.component';

const routes: Routes = [
  {
    path: '',
    component: CurrentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CurrentPage, ThisWeekComponent, TodayComponent]
})
export class CurrentPageModule {}
