import { match } from "path-to-regexp";

export class Router {
  private routes: Map<string, Function[]> = new Map();

  public getRoutes = (): Map<string, Function[]> => {
    return this.routes;
  };

  public get = (path: string, ...handlers: Function[]): void => {
    const currentHandlers = this.routes.get(`${path}/GET`) || [];
    this.routes.set(`${path}/GET`, [...currentHandlers, ...handlers]);
  };

  public post = (path: string, ...handlers: Function[]): void => {
    const currentHandlers = this.routes.get(`${path}/POST`) || [];
    this.routes.set(`${path}/POST`, [...currentHandlers, ...handlers]);
  };

  public put = (path: string, ...handlers: Function[]): void => {
    const currentHandlers = this.routes.get(`${path}/PUT`) || [];
    this.routes.set(`${path}/PUT`, [...currentHandlers, ...handlers]);
  };

  public patch = (path: string, ...handlers: Function[]): void => {
    const currentHandlers = this.routes.get(`${path}/PATCH`) || [];
    this.routes.set(`${path}/PATCH`, [...currentHandlers, ...handlers]);
  };

  public delete = (path: string, ...handlers: Function[]): void => {
    const currentHandlers = this.routes.get(`${path}/DELETE`) || [];
    this.routes.set(`${path}/DELETE`, [...currentHandlers, ...handlers]);
  };

  public sanitizeUrl = (url: string, method: string): string => {
    const urlParams = url.split("/").slice(1);

    const [lastParam] = urlParams[urlParams.length - 1].split("?");
    urlParams.splice(urlParams.length - 1, 1);

    const allParams = [...urlParams, lastParam].join("/");
    const sanitizedUrl = `/${allParams}/${method.toUpperCase()}`;

    return sanitizedUrl;
  };

  public matchUrl = (sanitizedUrl): boolean | string => {
    let result: boolean | string = false;

    for (const path of this.routes.keys()) {
      const urlMatch = match(path, {
        decode: decodeURIComponent,
      });

      const found = urlMatch(sanitizedUrl);

      if (found) {
        result = path;
        break;
      }
    }

    return result;
  };
}
