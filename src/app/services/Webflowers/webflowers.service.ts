import { Injectable } from "@angular/core";
import { AccessService } from "./Access/access.service";
import { WFExecuteProcedure } from "./Interfaces/wfexecute-procedure";
import { URLWebflowers } from "src/environments/environment";
import { DataResponseStoreProcedure } from "./Interfaces/data-response-store-procedure";
import { Support } from "./Interfaces/support";

export interface IWFResponse {
  d: string;
}

export interface IException {
  Data: any;
  Details: string | any;
  InnerException: IException;
  InnerMessages: string;
  Message: string;
  StackTrace: string;
}

export interface WFPrinpalResponse {
  Exception: IException;
  MethodName: string;
  RequestID: string;
  ServiceName: string;
  Value: any;
}

interface IResponseStoreProcedure {
  Data: Array<DataResponseStoreProcedure>;
}

interface IResponseExecuteView {
  Data: DataResponseStoreProcedure;
}

@Injectable({
  providedIn: "root"
})
export class WebflowersService {
  constructor(private http: AccessService) {}

  async generalStoreProcedure<T>(body: WFExecuteProcedure): Promise<T> {
    const res = await this.generalExecute<IResponseStoreProcedure>(body);
    if (!res) return null;
    if (!res.Data) return null;
    let support = Support.newInstance(DataResponseStoreProcedure, res.Data[0]);
    return <T>support.TransformProcedureRespond();
  }

  async generalStoreProcedureWithoutScheme<T>(
    body: WFExecuteProcedure
  ): Promise<T> {
    const res = await this.generalExecute<string>(body);
    const response = <T>JSON.parse(res);
    return response;
  }

  async generalExecuteView<T>(body: WFExecuteProcedure): Promise<T> {
    const res = await this.generalExecute<IResponseExecuteView>(body);
    if (!res) return null;
    if (!res.Data) return null;
    let support = Support.newInstance(DataResponseStoreProcedure, res.Data);
    return <T>support.TransformProcedureRespond();
  }

  async generalExecute<T>(body: WFExecuteProcedure): Promise<T> {
    const res = await this.ExecutePost<T>(
      "WinWebServiceCommand.svc/ExecuteCommandStream",
      body
    );
    if (!res) return null;
    return res;
  }

  private async ExecutePost<T>(
    prefix: string,
    params: WFExecuteProcedure
  ): Promise<T> {
    let stringUrl: string = URLWebflowers;
    let Url = stringUrl.endsWith("/") ? stringUrl.slice(0, -1) : stringUrl;
    return this.http
      .post<IWFResponse>(
        Url,
        { controller: prefix, body: params },
        { key: "Content-Type", value: "text/plain; charset=UTF-8" }
      )
      .then(res => {
        if (!res) return null;
        let wfResponse: WFPrinpalResponse = <WFPrinpalResponse>(
          JSON.parse(res.d)
        );

        if (wfResponse.Exception) {
          let exception: IException = wfResponse.Exception;
          while (exception.InnerException) {
            exception = exception.InnerException;
          }
          return null;
        }
        if (wfResponse.Value) return <T>wfResponse.Value;
        else return null;
      });
  }
}
