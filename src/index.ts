import { createServer, Server } from "http";
import { match } from "path-to-regexp";

export class App {
  private routes: Map<string, any>;
  private server: Server;

  constructor() {
    this.server = this.createMyServer();
    this.routes = new Map();
  }

  private createMyServer(): Server {
    return createServer(this.serverHandler.bind(this));
  }

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

  private sanitizeUrl = (url: string, method: string): string => {
    const urlParams = url.split("/").slice(1);

    const [lastParam] = urlParams[urlParams.length - 1].split("?");
    urlParams.splice(urlParams.length - 1, 1);

    const allParams = [...urlParams, lastParam].join("/");
    const sanitizedUrl = `/${allParams}/${method.toUpperCase()}`;

    return sanitizedUrl;
  };

  private matchUrl = (sanitizedUrl): boolean | string => {
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

  private serverHandler = async (request, response) => {
    const sanitizedUrl = this.sanitizeUrl(request.url, request.method);

    const match = this.matchUrl(sanitizedUrl);

    if (match && typeof match === "string") {
      const middlewaresAndControllers = this.routes.get(match);
      response.statusCode = 200;
      response.end("Found");
    } else {
      response.statusCode = 404;
      response.end("Not found");
    }
  };

  public run = (port: string, extraFunction?: Function) => {
    this.server.listen(port);
    if (extraFunction) extraFunction();
  };
}
