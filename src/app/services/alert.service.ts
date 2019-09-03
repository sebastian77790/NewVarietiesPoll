import { AlertController } from "@ionic/angular";
import { Injectable } from "@angular/core";

import { NavController } from "@ionic/angular";

import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: "root"
})
export class AlertService {
  Thanks: string;
  EvaluateMore: string;
  Options: any;

  constructor(public alertController: AlertController, private router: NavController, private _translate: TranslateService) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['Cancel', 'Open Modal', 'Delete']
    });

    await alert.present();
  }

  async presentAlertConfirm() {
    this._translate.get('THANKS').subscribe((res: any) => {
      this.Thanks = res;
    });
    this._translate.get('EVALUATEMORE').subscribe((res: any) => {
      this.EvaluateMore = res;
    });
    this._translate.get('OPTIONS').subscribe((res: any) => {
      this.Options = res;
    });
    
    const alert = await this.alertController.create({
      header: this.Thanks,
      message: `<strong>${this.EvaluateMore}?</strong>`,
      buttons: [
        {
          text: this.Options.NO,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.router.navigateBack(["login"]);
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.Options.YES,
          handler: () => {
            this.router.navigateBack(["home"]);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
}
