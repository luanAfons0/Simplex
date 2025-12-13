class DIContainer {
  private dependencies: Array<any> = [];

  public setupDependencies(dependencies: Array<any>) {
    dependencies.forEach((target: any) => {
      const isInjectable = Reflect.getMetadata("injectable", target);

      if (!isInjectable) 
        return;
      

      const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];

      const childrenDep = paramTypes.map((paramType: any) => {
        // recursively resolve all child dependencies:
        this.setupDependencies([paramType]);

        if (!this.dependencies[paramType.name]) {
          this.dependencies[paramType.name] = new paramType();
          return this.dependencies[paramType.name];
        }
        return this.dependencies[paramType.name];
      });

      if (!this.dependencies[target.name]) {
        this.dependencies[target.name] = new target(...childrenDep);
      }
    });

    return this;
  }

  public get<T extends new (...args: any[]) => any>(
    serviceClass: T,
  ): InstanceType<T> {
    return this.dependencies[(serviceClass as any).name];
  }
}

export default DIContainer;
