import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { CodeInfo } from '../extensions/models.model';

@Injectable({
    providedIn: "root"
})
export class FavoriteCodeStore {
    private _favoriteCodesSubject = new BehaviorSubject({});

    constructor(private storage: Storage) {
        this.loadInitialData();
    }

    get favoriteCodes(): Observable<any> {
        return this._favoriteCodesSubject.asObservable();
    }

    private loadInitialData() {
        this.storage.get('favoriteCodes').then(
            (favoriteCodes) => {
                this._favoriteCodesSubject.next(favoriteCodes || {});
            }
        )
    }

    public toggleCode(codeInfo: CodeInfo) {
        const favoriteCodes = this._favoriteCodesSubject.getValue();

        if (codeInfo.Favorite) {
            codeInfo.Favorite = false;
            delete favoriteCodes[codeInfo.invCodeId];
        } else {
            codeInfo.Favorite = true;
            favoriteCodes[codeInfo.invCodeId] = codeInfo;
        }

        this.storage.set('favoriteCodes', favoriteCodes).then(() => {
            this._favoriteCodesSubject.next(favoriteCodes);
        });
    }
}