import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-codedetail',
  templateUrl: './codedetail.page.html',
  styleUrls: ['./codedetail.page.scss'],
})
export class CodedetailPage implements OnInit {
  codeinfo: {};

  constructor(private storage: Storage) { }

  async ngOnInit() {
    this.codeinfo = await this.storage.get("labelinfo");
  }

}
