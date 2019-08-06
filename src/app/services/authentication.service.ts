import { Injectable, OnInit, Optional } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Platform, NavController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { ToastService } from "../services/toast.service";
import { Guid } from "../extensions/guid.cl";
import { login } from "../extensions/models.model";

@Injectable({
  providedIn: "root"
})
export class AuthenticationService implements OnInit {
  async ngOnInit(): Promise<void> {
    await this.platform.ready();
    this.ifLoggedIn();
  }
  authState = new BehaviorSubject(false);

  constructor(
    private router: NavController,
    @Optional()  private storage: Storage,
    private platform: Platform,
    private toaster: ToastService
  ) {}

  async ifLoggedIn() {
    const response = await this.storage.get("USER_INFO");
    if (response) {
      this.authState.next(true);
    }
  }

  async login(Login:login) {
    if(Login.CodeVerify != "WFGS2019") {
      this.toaster.presentErrorToast("Código no válido");
    } else {
      const userexist = await this.storage.get("USER_INFO");
      let user_response = {};
      if(userexist){
        user_response = {
          user_id: Login.UserId,
          user_name: Login.Name,
          user_email: Login.Email,
          user_company: Login.Company,
          code: Login.CodeVerify,
          user_terms: true
        };
      } else {
        user_response = {
          user_id: Login.UserId,//Guid.newGuid(),
          user_name: Login.Name,
          user_email: Login.Email,
          user_company: Login.Company,
          code: Login.CodeVerify,
          user_terms: true
        };
      }
        
      const response = await this.storage.set("USER_INFO", user_response);
      if (response) {   
        this.router.navigateRoot(["home"]);
        this.authState.next(true);
      }

      this.toaster.presentToast("Escanea la etiqueta");
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
