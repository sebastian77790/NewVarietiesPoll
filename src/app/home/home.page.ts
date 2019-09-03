import { Component, OnInit } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthenticationService } from '../services/authentication.service';
import { ToastService } from "../services/toast.service";
import { LoaderService } from '../services/loader.services';
import { WFCallsService } from '../services/Webflowers/wfcalls.service';

import { TranslateService } from '@ngx-translate/core';

import { NavController } from "@ionic/angular";
import { Storage } from '@ionic/storage';
import { ServicesService } from "../services/services.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  barcodeScannerOptions: any;
  scannedResult: any;
  //response:any;
  scannedCodes: any = [];
  ScannedCode: string;
  InfoNotFound: string;
  CodeNotFound: string;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private authService: AuthenticationService,
    private toaster: ToastService,
    private router: NavController,
    private loadingService: LoaderService,
    private wfcallsservice: WFCallsService,
    private storage: Storage,
    private _translate: TranslateService,
    private services: ServicesService
  ) {

    this.barcodeScannerOptions = {
      resultDisplayDuration: 500,
      disableAnimations: false,
      disableSuccessBeep: false
    }

  }

  ngOnInit() {
    this._translate.get('SCANNEDCODE').subscribe((res: any) => {
      this.ScannedCode = res;
    });
    this._translate.get('INFONOTFOUND').subscribe((res: any) => {
      this.InfoNotFound = res;
    });
    this._translate.get('CODENOTFOUND').subscribe((res: any) => {
      this.CodeNotFound = res;
    });
  }

  async ionViewDidEnter() {
    this.scanCode();
  }

  scanCode() {
    this.barcodeScanner.scan(this.barcodeScannerOptions)
      .then(async result => {
        this.scannedResult = result.text;

        if (this.scannedResult.startsWith("INV")) {//this.scannedResult.startsWith("INV")
          this.loadingService.presentLoading();
          const response = await this.services.getProductInfo(this.scannedResult.substring(3)).toPromise().catch(() => {//this.scannedResult.substring(3)
            return null;
          });
          if (!response) this.toaster.presentErrorToast('Code Not Found');

          //const response = await this.wfcallsservice.getLabelInfo(this.scannedResult.substring(3));
          if (response) {
            this.storage.set("labelinfo", response);
            const scannedCodes = await this.storage.get("scannedCodes");
            if (scannedCodes) {
              if (!scannedCodes.some((item) => item.invCodeId == response.invCodeId)) {
                this.scannedCodes = Array.from(scannedCodes);
                this.scannedCodes.push(response);
                this.storage.set("scannedCodes", this.scannedCodes);
              }
            } else {
              let temp = new Array();
              temp.push(response);
              this.storage.set("scannedCodes", temp);
            }

            this.toaster.presentToast(`${this.ScannedCode}: ${this.scannedResult}`);
            this.loadingService.dismissLoading();
            this.router.navigateForward(["dashboard"]);
          } else {
            this.toaster.presentErrorToast(this.InfoNotFound);
            this.loadingService.dismissLoading();
          }
        } else {
          this.loadingService.dismissLoading();
          this.toaster.presentErrorToast(this.CodeNotFound);
        }
      })
      .catch(error => {
        alert(error.message); // Error message
        this.loadingService.dismissLoading();
      });
  }


  logoutUser() {
    this.authService.logout();
  }
}
