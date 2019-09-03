import { Component } from '@angular/core';
import { login } from "src/app/extensions/models.model";
import { AuthenticationService } from '../services/authentication.service';

import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';

import { ModalController, NavController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { Storage } from '@ionic/storage';
import { ToastService } from "../services/toast.service";
import { LoaderService } from "../services/loader.services";

import { ServicesService } from "../services/services.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  Login: login = new login();
  public language: string;
  customActionSheetOptions: any = {
  };
  dataReturned: any;

  public Title: string;
  public SecurityCode: string;
  public UserTerms: string;
  private session: string;
  public Error: string;
  public UserCleaned: string;

  constructor(
    private authService: AuthenticationService,
    private globalization: Globalization,
    private _translate: TranslateService,
    public modalController: ModalController,
    private storage: Storage,
    private toaster: ToastService,
    private services: ServicesService,
    private loadingService: LoaderService,
    private router: NavController
  ) {
  }


  async ionViewDidEnter() {
    const user = await this.storage.get("USER_INFO");
    if (user) {
      this.Login.Name = user.user_name;
      this.Login.Email = user.user_email;
      this.Login.UserId = user.user_id;
      this.Login.Company = user.user_company;
      this.Login.Terms = user.user_terms;
    }
    this.getDeviceLanguage();
  }

  async cleanUser() {
    this.Login.Name = "";
    this.Login.Email = "";
    this.Login.UserId = "";
    this.Login.Company = "";
    this.Login.Terms = false;
    const storage = await this.storage.clear();
    this.toaster.presentToast(this.UserCleaned);
  }

  goToFavorites(){
    this.router.navigateForward(["favorites"]);
  }  

  _initialiseTranslation(): void {
    this._translate.get('TITLE').subscribe((res: string) => {
      this.Title = res;
    });
    this._translate.get('SECURITYCODE').subscribe((res: string) => {
      this.SecurityCode = res;
    });
    this._translate.get('USERTERMS').subscribe((res: any) => {
      this.UserTerms = res;
    });
    this._translate.get('ERROR').subscribe((res: any) => {
      this.Error = res;
    });
    this._translate.get('USERCLEANED').subscribe((res: any) => {
      this.UserCleaned = res;
    });
  }

  public changeLanguage(e): void {
    this._translateLanguage();
  }

  _translateLanguage(): void {
    this._translate.use(this.language);
    this._initialiseTranslation();
  }

  _initTranslate() {
    this._translate.setDefaultLang('es');

    if (this._translate.getBrowserLang() !== undefined) {
      this.language = this._translate.getBrowserLang();
      console.log('browser language is', this._translate.getBrowserLang());
    }
    else {
      // Set your language here
      this.language = 'es';
    }

    this._translateLanguage();
  }

  getDeviceLanguage() {
    this.globalization.getPreferredLanguage()
      .then(res => {
        this._initTranslate();
      })
      .catch(e => console.log(e));
  }

  async loginUser() {
    if (this.Login.Terms) {
      this.Login.Language = this.language.toUpperCase();
      this.loadingService.presentLoading();
      const Session = await this.services.PostNewUser(this.Login).toPromise().catch(() => {
        return null;
      });

      if (!Session) this.toaster.presentErrorToast(this.Error);
      else {
        this.session = Session["sessionId"];
        this.Login.UserId = this.session;
        this.loadingService.dismissLoading();
        this.authService.login(this.Login);
      };

      this.loadingService.dismissLoading();
    } else {
      this.openModal();
    }
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        "paramID": 123,
        "paramTitle": this.UserTerms
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }

      this.Login.Terms = true;
      this.loginUser();
    });

    return await modal.present();
  }

}
