import { Injectable, OnInit, Optional } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Platform, NavController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { ToastService } from "./toast.service";
import { Guid } from "../extensions/guid.cl";
import { login } from "../extensions/models.model";

import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: "root"
})
export class AuthenticationService implements OnInit {
  async ngOnInit(): Promise<void> {
    this._translate.get('SCANLABEL').subscribe((res: any) => {
      this.ScanLabel = res;
    });
    await this.platform.ready();
    this.ifLoggedIn();
  }
  authState = new BehaviorSubject(false);

  ScanLabel: string;

  constructor(
    private router: NavController,
    //@Optional()  private storage: Storage,
    private storage: Storage,
    private platform: Platform,
    private toaster: ToastService,
    private _translate: TranslateService
  ) { }

  async ifLoggedIn() {
    const response = await this.storage.get("USER_INFO");
    if (response) {
      this.authState.next(true);
    }
  }

  async login(Login: login) {
    if (Login.CodeVerify != "WFGS2019") {
      this.toaster.presentErrorToast("Código no válido");
    } else {
      const userexist = await this.storage.get("USER_INFO");
      let user_response = {};
      if (userexist) {
        user_response = {
          user_id: Login.UserId,
          user_name: Login.Name,
          user_email: Login.Email,
          user_company: Login.Company,
          code: Login.CodeVerify,
          user_terms: true,
          language: Login.Language
        };
      } else {
        user_response = {
          user_id: Login.UserId,//Guid.newGuid(),
          user_name: Login.Name,
          user_email: Login.Email,
          user_company: Login.Company,
          code: Login.CodeVerify,
          user_terms: true,
          language: Login.Language
        };
      }

      const response = await this.storage.set("USER_INFO", user_response);
      if (response) {
        this.router.navigateRoot(["home"]);
        this.authState.next(true);
      }

      this.toaster.presentToast(this.ScanLabel);
    }

  }

  async logout() {
    await this.storage.remove("USER_INFO");
    this.router.navigateRoot(["login"]);
    this.authState.next(false);
  }

  isAuthenticated() {
    return this.authState.value;
  }
}
