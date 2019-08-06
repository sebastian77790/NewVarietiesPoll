import { IGeneralRequest } from "./general-request";
import { IKeyValuePair } from "./key-value-pair";

export interface IPutRequest extends IGeneralRequest {
  body: any | object;
  params?: Array<IKeyValuePair<string, string>>;
}
