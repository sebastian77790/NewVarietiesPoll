import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/Auth-Guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardPageModule',
    canActivate: [AuthGuard]
  },
  { path: 'charts', loadChildren: './charts/charts/charts.module#ChartsPageModule', canActivate: [AuthGuard] },
  { path: 'arflowersinfo', loadChildren: './arflowersinfo/arflowersinfo.module#ArflowersinfoPageModule', canActivate: [AuthGuard] },
  { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' },
  { path: 'favorites', loadChildren: './favorites/favorites.module#FavoritesPageModule', canActivate: [AuthGuard] },  { path: 'codedetail', loadChildren: './codedetail/codedetail.module#CodedetailPageModule' },

]; 

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
