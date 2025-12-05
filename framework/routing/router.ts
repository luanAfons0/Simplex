class Router {
  private appRoutes: Map<string, Array<Function>> = new Map<
    string,
    Array<Function>
  >();

  public post(path: string, ...functions: Array<Function>): void {
    this.appRoutes.set(`POST ${path}`, functions);
  }

  public get(path: string, ...functions: Array<Function>): void {
    this.appRoutes.set(`GET ${path}`, functions);
  }

  public put(path: string, ...functions: Array<Function>): void {
    this.appRoutes.set(`PUT ${path}`, functions);
  }

  public patch(path: string, ...functions: Array<Function>): void {
    this.appRoutes.set(`PATCH ${path}`, functions);
  }

  public delete(path: string, ...functions: Array<Function>): void {
    this.appRoutes.set(`DELETE ${path}`, functions);
  }

  public getRoutes(): Map<string, Array<Function>> {
    return this.appRoutes;
  }
}

export { Router };
