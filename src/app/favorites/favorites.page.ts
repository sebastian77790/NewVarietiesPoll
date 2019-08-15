import { Component } from '@angular/core';
import { LoaderService } from "../services/loader.services";
import { Storage } from "@ionic/storage";
import { FavoriteCodeStore } from '../shared/code-favorite.store';
import { Subscription } from "rxjs";
import { CodeInfo } from '../extensions/models.model';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from "../services/toast.service";

@Component({
  selector: "app-favorites",
  templateUrl: "./favorites.page.html",
  styleUrls: ["./favorites.page.scss"]
})
export class FavoritesPage {
  codes: CodeInfo[] = [];
  copyOfCodes: CodeInfo[] = [];

  isLoading: boolean = false;

  favoriteCodes: any = {};
  favoriteCodeSub: Subscription;

  public FavoriteAdded: string;

  constructor(
    private loadingService: LoaderService,
    private storage: Storage,
    private favoriteCardStore: FavoriteCodeStore,
    private _translate: TranslateService,
    private toaster: ToastService
  ) {

    this.favoriteCodeSub = this.favoriteCardStore.favoriteCodes.subscribe((favoriteCodes: any) => {
      this.favoriteCodes = favoriteCodes || {};
    })
  }

  private async getCodes() {
    await this.loadingService.presentLoading();
    this.codes = await this.storage.get("scannedCodes");
    this.codes = this.codes.map((code: CodeInfo) => {
      code.Favorite = this.isCodeFavorite(code.INVCodeId);
      if(!code.IMG) code.IMG = "";
      return code;
    });
    this.copyOfCodes = Array.from(this.codes);
    this.loadingService.dismissLoading();
  }

  private isCodeFavorite(codeId: string):boolean{
    const code = this.favoriteCodes[codeId];

    return code ? true : false;
  }

  ionViewDidLeave(){
    if (this.favoriteCodeSub && !this.favoriteCodeSub.closed){
      this.favoriteCodeSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    if (this.codes && this.codes.length === 0) this.getCodes();
    this._translate.get('FAVORITEADDED').subscribe((res: any) => {
      this.FavoriteAdded = res;
    });
  }
 
  doRefresh(event){
    this.getCodes();
    event.target.complete();
  }

  hydrateCodes(codes: CodeInfo[]){
    this.codes = codes;
    this.isLoading = false;
  }

  handleSearch(){
    this.isLoading = true;
  }

  favoriteCode(code: CodeInfo){
    this.favoriteCardStore.toggleCode(code);
    this.toaster.presentToast(this.FavoriteAdded);
  }

  updateImage(e){
    e.currentTarget.src = "assets/images/300x200.png";
  }

}
