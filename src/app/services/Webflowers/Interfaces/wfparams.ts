interface IWFParams {
  Name: string;
  Value: string | any;
  Type?: any;
  Direction?;
  SerializedValue?;
}

export class WFParams {
  Name: string;
  Value: string | any;
  Type?: any = null;
  Direction?: number = 1;
  SerializedValue?: boolean = true;
  constructor(param?: IWFParams) {
    this.Name = (param && param.Name) || "";
    this.Value =
      param && param.Value != undefined && param.Value != null
        ? param.Value
        : null;
    this.Type = (param && param.Type) || null;
    this.Direction = (param && param.Direction) || 1;
    this.SerializedValue =
      param &&
      param.SerializedValue != undefined &&
      param.SerializedValue != null
        ? param.SerializedValue
        : true;
  }
}
