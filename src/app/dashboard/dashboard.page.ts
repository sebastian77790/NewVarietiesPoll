import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

import { Storage } from '@ionic/storage';
import { NavController } from "@ionic/angular";

import { LoaderService } from "../services/loader.services";
import { FavoriteCodeStore } from '../shared/code-favorite.store';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from "../services/toast.service";
import { ServicesService } from "../services/services.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  info:any;
  public FavoriteAdded: string;

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    private router: NavController,
    private loadingService: LoaderService,
    private favoriteCardStore: FavoriteCodeStore,
    private _translate: TranslateService,
    private toaster: ToastService,
    private services: ServicesService
    ) { }
 
  ngOnInit() {
    this.storage.get('labelinfo').then((val) => {
      this.info = val[0];
    });
    this._translate.get('FAVORITEADDED').subscribe((res: any) => {
      this.FavoriteAdded = res;
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

  async likeCode(){
    await this.loadingService.presentLoading();
    const code = await this.storage.get("labelinfo");
    this.favoriteCardStore.toggleCode(code);
    const user = await this.storage.get("USER_INFO");
    if(code.Favorite){
      const answer = {
        "sessionId": user.user_id,
        "INVCode": code.labelConsecutive
      }
      const response = await this.services.SaveLike(answer).toPromise().catch(() => {
        return "";
      });
      if (response == "") this.toaster.presentErrorToast('Error');
    }    

    this.loadingService.dismissLoading();
    this.toaster.presentToast(this.FavoriteAdded);
  }
}
