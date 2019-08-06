export class DataResponseStoreProcedure {
  Columns: Array<string>;
  Rows: Array<Array<any>>;

  TransformProcedureRespond(): any {
    let result: Array<Object> = [];
    this.Rows.forEach((row, i) => {
      let value: object = {};
      this.Columns.forEach((colum, j) => {
        value[colum] = row[j];
      });
      result.push(value);
    });

    return result;
  }
}
