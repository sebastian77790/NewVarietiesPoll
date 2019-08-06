import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ArflowersinfoPage } from './arflowersinfo.page';

const routes: Routes = [
  {
    path: '',
    component: ArflowersinfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ArflowersinfoPage]
})
export class ArflowersinfoPageModule {}
