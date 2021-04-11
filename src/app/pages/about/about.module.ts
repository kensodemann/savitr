import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AboutPage } from './about.page';
import { AuthGuardService } from '@app/services';

const routes: Routes = [
  {
    canActivate: [AuthGuardService],
    path: '',
    component: AboutPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [AboutPage],
})
export class AboutPageModule {}
