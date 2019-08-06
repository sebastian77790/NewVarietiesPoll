import { Injectable } from "@angular/core";
import { WFExecuteProcedure } from "./Interfaces/wfexecute-procedure";
import { WFParams } from "./Interfaces/wfparams";
import { WFParameters } from "./Interfaces/wfparameters";
import { WebflowersService } from "./webflowers.service";

@Injectable({
  providedIn: "root"
})
export class WFCallsService {
  constructor(private wfHttp: WebflowersService) {}

  async getLabelInfo(consecutive: string) {
    let body = new WFExecuteProcedure("BaseDataAccess", "ExecuteProcedure");
    let parameters = new Array<WFParams>();
    parameters.push(
      new WFParams({
        Name: "Consecutive",
        Value: parseInt(consecutive)
         // SerializedValue: true | false
      })
    );

    body.Params.push(
      new WFParams({
        Name: "args",
        Value: new WFParameters("GetReadINVHarvestLabel", parameters)
      })
    );
  
    const response = await this.wfHttp.generalStoreProcedure<any>(body);
    return response;
  }

}
