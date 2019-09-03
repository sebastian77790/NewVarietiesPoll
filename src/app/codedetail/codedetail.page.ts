import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-codedetail',
  templateUrl: './codedetail.page.html',
  styleUrls: ['./codedetail.page.scss'],
})
export class CodedetailPage implements OnInit {
  codeinfo: { photoUrl: "assets/images/image_default.png" };

  constructor(
    private storage: Storage,
    private _translate: TranslateService
  ) { }

  async ngOnInit() {
    this.codeinfo = await this.storage.get("labelinfo");
  }

  updateImage() {
    this.codeinfo.photoUrl = "assets/images/image_default.png";
  }

}
