import { WFSession } from "./wfsession";
import { WFParams } from "./wfparams";
import { Guid } from "src/app/extensions/guid.cl";

export class WFExecuteProcedure {
  Session: WFSession = new WFSession();
  ServiceName: string;
  MethodName: string;
  Params: Array<WFParams> = new Array<WFParams>();
  GenericParams: any = null;
  Args: any = null;
  FullName: string = "";
  Serialized: boolean = true;
  SerializerType: string =
    "GloboStudio.Core.Serialization.JsonSerializer, GloboStudio.Core.Serialization";
  RequestID: string;

  constructor(serviceName: string, methodName: string) {
    this.ServiceName = serviceName;
    this.MethodName = methodName;
    this.RequestID = Guid.newGuid();
  }
}
