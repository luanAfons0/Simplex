const META_DATA_PREFIX = Symbol("prefix");

const { Controller, Get, Post, Put, Patch, Delete, appRoutes } = (() => {
  const appRoutes: Map<string, Array<Function>> = new Map<
    string,
    Array<Function>
  >();

  function Controller(prefix: string) {
    return function (target: any) {
      Reflect.defineMetadata(META_DATA_PREFIX, prefix, target.prototype);

      let httpMethods: Array<() => void> = Reflect.getMetadata(
        "httpMethods",
        target.prototype,
      );

      if (httpMethods) {
        httpMethods.forEach((method) => method());
      }

      return target;
    };
  }

  function Get(configObject?: {
    routePath?: string;
    middlewares?: Array<Function>;
  }) {
    let routePath = configObject?.routePath ?? "";
    let middlewares = configObject?.middlewares ?? [];

    return function (target: any, propertyKey: string) {
      const method = target[propertyKey];

      let functionsList: Array<Function> = [method];

      if (middlewares && middlewares?.length > 0) {
        functionsList = [...middlewares, method];
      }

      let httpMethods: Array<() => void> = Reflect.getMetadata(
        "httpMethods",
        target,
      );

      if (!httpMethods) {
        Reflect.defineMetadata("httpMethods", (httpMethods = []), target);
      }

      httpMethods.push(() => {
        appRoutes.set(
          `GET ${Reflect.getMetadata(META_DATA_PREFIX, target)}${routePath ?? ""}`,
          functionsList,
        );
      });
    };
  }

  function Post(configObject?: {
    routePath?: string;
    middlewares?: Array<Function>;
  }) {
    let routePath = configObject?.routePath ?? "";
    let middlewares = configObject?.middlewares ?? [];

    return function (target: any, propertyKey: string) {
      const method = target[propertyKey];

      let functionsList: Array<Function> = [method];

      if (middlewares && middlewares?.length > 0) {
        functionsList = [...middlewares, method];
      }

      let httpMethods: Array<() => void> = Reflect.getMetadata(
        "httpMethods",
        target,
      );

      if (!httpMethods) {
        Reflect.defineMetadata("httpMethods", (httpMethods = []), target);
      }

      httpMethods.push(() => {
        appRoutes.set(
          `POST ${Reflect.getMetadata(META_DATA_PREFIX, target)}${routePath ?? ""}`,
          functionsList,
        );
      });
    };
  }

  function Put(configObject?: {
    routePath?: string;
    middlewares?: Array<Function>;
  }) {
    let routePath = configObject?.routePath ?? "";
    let middlewares = configObject?.middlewares ?? [];

    return function (target: any, propertyKey: string) {
      const method = target[propertyKey];

      let functionsList: Array<Function> = [method];

      if (middlewares && middlewares?.length > 0) {
        functionsList = [...middlewares, method];
      }

      let httpMethods: Array<() => void> = Reflect.getMetadata(
        "httpMethods",
        target,
      );

      if (!httpMethods) {
        Reflect.defineMetadata("httpMethods", (httpMethods = []), target);
      }

      httpMethods.push(() => {
        appRoutes.set(
          `PUT ${Reflect.getMetadata(META_DATA_PREFIX, target)}${routePath ?? ""}`,
          functionsList,
        );
      });
    };
  }

  function Patch(configObject?: {
    routePath?: string;
    middlewares?: Array<Function>;
  }) {
    let routePath = configObject?.routePath ?? "";
    let middlewares = configObject?.middlewares ?? [];

    return function (target: any, propertyKey: string) {
      const method = target[propertyKey];

      let functionsList: Array<Function> = [method];

      if (middlewares && middlewares?.length > 0) {
        functionsList = [...middlewares, method];
      }

      let httpMethods: Array<() => void> = Reflect.getMetadata(
        "httpMethods",
        target,
      );

      if (!httpMethods) {
        Reflect.defineMetadata("httpMethods", (httpMethods = []), target);
      }

      httpMethods.push(() => {
        appRoutes.set(
          `PATCH ${Reflect.getMetadata(META_DATA_PREFIX, target)}${routePath ?? ""}`,
          functionsList,
        );
      });
    };
  }

  function Delete(configObject?: {
    routePath?: string;
    middlewares?: Array<Function>;
  }) {
    let routePath = configObject?.routePath ?? "";
    let middlewares = configObject?.middlewares ?? [];

    return function (target: any, propertyKey: string) {
      const method = target[propertyKey];

      let functionsList: Array<Function> = [method];

      if (middlewares && middlewares?.length > 0) {
        functionsList = [...middlewares, method];
      }

      let httpMethods: Array<() => void> = Reflect.getMetadata(
        "httpMethods",
        target,
      );

      if (!httpMethods) {
        Reflect.defineMetadata("httpMethods", (httpMethods = []), target);
      }

      httpMethods.push(() => {
        appRoutes.set(
          `DELETE ${Reflect.getMetadata(META_DATA_PREFIX, target)}${routePath ?? ""}`,
          functionsList,
        );
      });
    };
  }

  return {
    appRoutes,
    Controller,
    Get,
    Post,
    Delete,
    Patch,
    Put,
  };
})();

export { Controller, Get, Post, Put, Patch, Delete, appRoutes };
