import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

import { Storage } from '@ionic/storage';
import { NavController } from "@ionic/angular";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  info:any;

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    private router: NavController
    ) { }
 
  ngOnInit() {
    this.storage.get('labelinfo').then((val) => {
      this.info = val[0];
    });
  }
 
  logoutUser(){
    this.authService.logout();
  }

  goToResults(){
    this.router.navigateForward(["charts"]);
  }

  goToAR(){
    this.router.navigateForward(["arflowersinfo"]);
  }

  goToFavorites(){
    this.router.navigateForward(["favorites"]);
  }  
  
  goToInfo(){
    this.router.navigateForward(["codedetail"]);
  }  
}
