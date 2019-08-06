import { IKeyValuePair } from "./key-value-pair";
import { IGeneralRequest } from "./general-request";

export interface IGetRequest extends IGeneralRequest {
  params?: Array<IKeyValuePair<string, string>>;
}
