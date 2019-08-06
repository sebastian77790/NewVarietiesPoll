import { IGeneralRequest } from "./general-request";
import { IKeyValuePair } from "./key-value-pair";

export interface IPostRequest extends IGeneralRequest {
  body: any | object;
  params?: Array<IKeyValuePair<string, string>>;
}
