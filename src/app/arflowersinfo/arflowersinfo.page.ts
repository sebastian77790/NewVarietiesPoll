import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-arflowersinfo',
  templateUrl: './arflowersinfo.page.html',
  styleUrls: ['./arflowersinfo.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArflowersinfoPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  close(){
    this.modalCtrl.dismiss();
  }

}
