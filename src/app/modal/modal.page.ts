import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
 
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  
  modalTitle:string;
  modelId:number;
  
  public UserTerms_Text: string;
  public UserTerms_More: string;
  public UserTerms_Link: string;
 
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private _translate: TranslateService
  ) { }
 
  ngOnInit() {
    console.table(this.navParams);
    this.modelId = this.navParams.data.paramID;
    this.modalTitle = this.navParams.data.paramTitle;
    this._translate.get('USERTERMS_TEXT').subscribe((res: any) => {
      this.UserTerms_Text = res;
    });
    this._translate.get('USERTERMS_MORE').subscribe((res: any) => {
      this.UserTerms_More = res;
    });
    this._translate.get('USERTERMS_LINK').subscribe((res: any) => {
      this.UserTerms_Link = res;
    });
  }
  
  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }
}