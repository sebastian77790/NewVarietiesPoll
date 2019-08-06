import { Component } from '@angular/core';
import { login } from "src/app/extensions/models.model";
import { AuthenticationService } from '../services/Authentication.service';

import { Globalization } from '@ionic-native/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';

import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { Storage  } from '@ionic/storage';
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
  public Languages:any;
  public language: string;
  customActionSheetOptions: any = {
    // header: 'Idioma',
    // subHeader: 'Selecciona tu idioma'
  };
  dataReturned:any;

  public Enter: string;
  public Title: string;
  public Name: string;
  public Email: string;
  public Company: string;
  public SecurityCode: string;
  public Select: string;
  public UserTerms: string;
  private session:string;

  constructor(
    private authService: AuthenticationService,
    private globalization: Globalization, 
    private _translate: TranslateService,
    public modalController: ModalController,
    private storage: Storage,
    private toaster: ToastService,
    private services: ServicesService,
    private loadingService: LoaderService
     ) {
       this.Languages = {sp:'', en:'', opt:''};
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

    async cleanUser(){
      this.loadingService.presentLoading();
      this.Login.Name = "";
      this.Login.Email = "";
      this.Login.UserId = "";
      this.Login.Company = "";
      this.Login.Terms = false;
      const storage = await this.storage.clear();
      //this.storage.remove("scannedCodes");
      // this.storage.remove("USER_INFO");
      // this.storage.remove("labelinfo");
      this.loadingService.dismissLoading();
      this.toaster.presentToast("Usuario Limpiado");
    }


    _initialiseTranslation(): void {
      this._translate.get('ENTER').subscribe((res: string) => {
        this.Enter = res;
      });
      this._translate.get('TITLE').subscribe((res: string) => {
        this.Title = res;
      });
      this._translate.get('NAME').subscribe((res: string) => {
        this.Name = res;
      });
      this._translate.get('EMAIL').subscribe((res: string) => {
        this.Email = res;
      });
      this._translate.get('COMPANY').subscribe((res: string) => {
        this.Company = res;
      });
      this._translate.get('SECURITYCODE').subscribe((res: string) => {
        this.SecurityCode = res;
      });
      this._translate.get('SELECT').subscribe((res: string) => {
        this.Select = res;
      });
      this._translate.get('LANGUAGES').subscribe((res: any) => {
        this.Languages.sp = res.SP;
        this.Languages.en = res.EN;
        // this.Languages.opt = res.OPT;
      });
      this._translate.get('USERTERMS').subscribe((res: any) => {
        this.UserTerms = res;
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
      // Set the default language for translation strings, and the current language.
      this._translate.setDefaultLang('en');
  
      if (this._translate.getBrowserLang() !== undefined) {
        this.language = this._translate.getBrowserLang();
        console.log('browser language is', this._translate.getBrowserLang());
      }
      else {
        // Set your language here
        this.language = 'en';
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

  async loginUser(){
    if(this.Login.Terms){
      this.Login.Language = this.language.toUpperCase();
      this.loadingService.dismissLoading();
      const Session = await this.services.PostNewUser(this.Login).subscribe(
        (response: any) => {
          this.session = response["sessionId"];
          this.Login.UserId = this.session;
          this.loadingService.dismissLoading();
          this.authService.login(this.Login);
        },
        err => {
          this.loadingService.dismissLoading();
          this.toaster.presentErrorToast("Ocurrió un Error");
        }
      );
    }else{
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
        //alert('Modal Sent Data :'+ dataReturned);
      }

      this.Login.Terms = true;
      this.loginUser();
    });
 
    return await modal.present();
  }

  // acceptTerms(){
  //   this.Login.Terms = true;
  //   this.loginUser();
  // }

}
