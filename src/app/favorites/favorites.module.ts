import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchModule } from "../components/search/search.module";

import { FavoritesPage } from './favorites.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SearchModule
  ],
  declarations: [FavoritesPage]
})
export class FavoritesPageModule {}