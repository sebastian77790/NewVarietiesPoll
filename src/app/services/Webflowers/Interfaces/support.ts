export class Support {
  static newInstance<T>(TCreate: new () => T, obj: any) {
    let instance = new TCreate();
    Object.assign(instance, obj);
    return instance;
  }
}
