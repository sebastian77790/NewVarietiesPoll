import { AlertController } from "@ionic/angular";
import { Injectable } from "@angular/core";

import { NavController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class AlertService {
  constructor(public alertController: AlertController, private router: NavController) {}

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
    const alert = await this.alertController.create({
      header: 'Gracias por participar!',
      message: '<strong>Evaluar Otra Variedad?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.router.navigateBack(["login"]);
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
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
