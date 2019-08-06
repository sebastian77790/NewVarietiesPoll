import { WFParams } from "./wfparams";

export class WFParameters {
  Name: string;
  Parameters: Array<WFParams>;
  constructor(name: string, parameters: Array<WFParams>) {
    this.Name = name;
    this.Parameters = parameters;
  }
}
