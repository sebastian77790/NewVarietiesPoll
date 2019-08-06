import { Component } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthenticationService } from '../services/Authentication.service';
import { ToastService } from "../services/toast.service";
import { LoaderService } from '../services/loader.services';
import { WFCallsService } from '../services/Webflowers/wfcalls.service';

import { NavController } from "@ionic/angular";
import { Storage  } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  barcodeScannerOptions:any;
  scannedResult:any;
  response:any;
  scannedCodes: any = [];
 
  constructor(
    private barcodeScanner: BarcodeScanner,
    private authService: AuthenticationService,
    private toaster: ToastService,
    private router: NavController,
    private loadingService: LoaderService,
    private wfcallsservice: WFCallsService,
    private storage: Storage 
  ) {
 
    this.barcodeScannerOptions = {
      resultDisplayDuration: 500,
      disableAnimations : false, 
      disableSuccessBeep: false
    }
 
  }

  // ionViewDidEnter() {
  //     document.addEventListener("backbutton",function(e) {
  //       if (this.navCtrl.canGoBack()) {
  //         this.platform.exitApp();
  //         return;
  //       }
  //     }, false);
  // }

  ngOnInit() {
    this.scanCode();
  }
 
 scanCode(){
    this.barcodeScanner.scan(this.barcodeScannerOptions)
   .then(async result => {
      this.scannedResult = result.text;

      if(this.scannedResult.startsWith("INV")){
        this.loadingService.presentLoading();
        this.response = await this.wfcallsservice.getLabelInfo(this.scannedResult.substring(3));
        if(this.response){
          this.storage.set('labelinfo', this.response);
          const scannedCodes = await this.storage.get("scannedCodes");
          if (scannedCodes){
            if (!scannedCodes.some((item) => item.INVCodeId == this.response[0].INVCodeId)) {
              this.scannedCodes = Array.from(scannedCodes);
              this.scannedCodes.push(this.response[0]);
              this.storage.set('scannedCodes', this.scannedCodes);
            }  
          } else this.storage.set('scannedCodes', this.response);  
   
          this.toaster.presentToast(`Etiqueta Escaneada: ${this.scannedResult}`);
          this.loadingService.dismissLoading();
          this.router.navigateForward(["dashboard"]);
        } else {
          this.toaster.presentErrorToast("No se encontró la información");
          this.loadingService.dismissLoading();
        }        
      } else{
        this.loadingService.dismissLoading();
        this.toaster.presentErrorToast("Código Erroneo");
      }
   })
   .catch(error => {
     //this.loadingService.dismissLoading();
      alert(error.message); // Error message
      this.loadingService.dismissLoading();
   });
  }
 

  logoutUser(){
    this.authService.logout();
  }
}
