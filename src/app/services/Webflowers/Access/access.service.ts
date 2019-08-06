import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { IGetRequest } from "../Interfaces/get-request";
import { IPostRequest } from "../Interfaces/post-request";
import { IPutRequest } from "../Interfaces/put-request";
import { IKeyValuePair } from "../Interfaces/key-value-pair";

@Injectable({
  providedIn: "root"
})
export class AccessService {
  constructor(private http: HttpClient) {}

  private errorHandler = <T>(
    e: HttpErrorResponse,
    showError: boolean = true
  ): T => {
    if (showError) console.error(e.error);
    throw e;
  };

  async get<T>(
    URL,
    params: IGetRequest,
    headers?: { key: string; value: string } | { key: string; value: string }[],
    showError: boolean = true
  ): Promise<T> {
    let uri = this.getURL(URL, params, params.params);
    let defaultHeader = this.buildHeader(headers);

    return this.http
      .get<T>(uri, { headers: defaultHeader })
      .pipe(
        map(resp => {
          return resp;
        }),
        catchError((err, ob) => {
          this.errorHandler<T>(err, showError);
          return ob;
        })
      )
      .toPromise();
  }

  async post<T>(
    URL,
    params: IPostRequest,
    headers?: { key: string; value: string } | { key: string; value: string }[],
    showError: boolean = true,
    useSlashToSeparateParams: boolean = false
  ): Promise<T> {
    let uri = this.getURL(URL, params, params.params, useSlashToSeparateParams);
    let defaultHeader = this.buildHeader(headers);

    return this.http
      .post<T>(uri, params.body, { headers: defaultHeader })
      .pipe(
        map(resp => {
          return resp;
        }),
        catchError((err, ob) => {
          this.errorHandler<T>(err, showError);
          return ob;
        })
      )
      .toPromise();
  }

  async put<T>(
    URL,
    params: IPutRequest,
    headers?: { key: string; value: string } | { key: string; value: string }[],
    showError: boolean = true
  ): Promise<T> {
    let uri = this.getURL(URL, params, params.params, true);
    let defaultHeader = this.buildHeader(headers);

    return this.http
      .put<T>(uri, params.body, { headers: defaultHeader })
      .pipe(
        map(resp => {
          return resp;
        }),
        catchError((err, ob) => {
          this.errorHandler<T>(err, showError);
          return ob;
        })
      )
      .toPromise();
  }

  private getURL(
    URL,
    params: IGetRequest | IPostRequest | IPutRequest,
    queryParams: Array<IKeyValuePair<string, string>> = null,
    useSlashToSeparateParams: boolean = false
  ): string {
    let useAction: boolean =
      params.action != null &&
      params.action != undefined &&
      params.action.trim() != "";

    let parameters = this.getParamsURL(queryParams, useSlashToSeparateParams);
    let Url = `${URL}/${params.controller}`;
    return useAction
      ? `${Url}/${params.action}${parameters}`
      : `${Url}${parameters}`;
  }

  private getParamsURL(
    keyValue?: Array<IKeyValuePair<string, string>>,
    useSlashToSeparateParams: boolean = false
  ): string {
    let uri = "";
    if (keyValue != null) {
      uri += useSlashToSeparateParams ? "" : "?";
      keyValue.forEach(
        (element: IKeyValuePair<string, string>, index: number) => {
          if (!useSlashToSeparateParams) {
            if (index != 0) uri += "&";
            uri += `${element.key}=${element.value}`;
          } else {
            uri += `/${element.value}`;
          }
        }
      );
    }

    return uri;
  }

  private buildHeader(
    headers?: { key: string; value: string } | { key: string; value: string }[]
  ): any {
    let defaultHeader = this.getDefaultHeader();
    if (headers) {
      if (headers instanceof Array) {
        headers.forEach(header => {
          defaultHeader[header.key] = header.value;
        });
      } else {
        defaultHeader[headers.key] = headers.value;
      }
    }

    return defaultHeader;
  }

  private getDefaultHeader(): any {
    return { "Content-Type": "application/json; charset=utf-8" };
  }
}
