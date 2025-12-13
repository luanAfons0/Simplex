import DIContainer from "./di-container.js";

const { Inject, Injectable, initDIContainer } = (function () {
  let diContainer: DIContainer | null = null;

  function initDIContainer(dependencies: Array<any>) {
    diContainer = new DIContainer();

    diContainer.setupDependencies(dependencies);
  }

  function Injectable() {
    return function (target: any) {
      Reflect.defineMetadata("injectable", true, target);
    };
  }

  function Inject<T>(injectionType: T) {
    if (!diContainer) {
      throw new Error(
        "Could find the Dependency Injection container, make sure to call 'initDIContainer'",
      );
    }

    const dependencyInstance = diContainer.get(injectionType as any);

    return function (_: any, __: string) {
      return dependencyInstance;
    };
  }

  return { Inject, Injectable, initDIContainer };
})();

export { Inject, Injectable, initDIContainer };
