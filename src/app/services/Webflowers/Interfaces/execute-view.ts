export interface ISort {
  Name: string;
  SortDirection: number;
}
export interface IFilter {
  ConditionType: number;
  ConditionValues: any;
  GroupingMode: Number;
  IncludeNullValues: boolean;
  LogicalOperator: number;
  Name: string;
}

export interface IFilterGroup {
  Filters: Array<IFilter>;
  LogicalOperator: number;
}

export class ExecuteView {
  Columns: any = null;
  ViewName: string;
  Sorts: Array<ISort> = new Array<ISort>();
  Paging: any = null;
  GroupingFilterGroups: any = null;
  FilterGroups: Array<IFilterGroup> = new Array<IFilterGroup>();
  constructor(viewname: string) {
    this.ViewName = viewname;
  }
}
