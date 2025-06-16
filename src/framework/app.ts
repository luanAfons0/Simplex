import { createServer, Server } from "http";
import { Router } from "./router.js";

export class App {
  private server: Server;
  public router: Router;

  constructor() {
    this.server = this.createMyServer();
    this.router = new Router();
  }

  private createMyServer(): Server {
    return createServer(this.serverHandler.bind(this));
  }

  private serverHandler = async (request, response) => {
    const sanitizedUrl = this.router.sanitizeUrl(request.url, request.method);

    const match = this.router.matchUrl(sanitizedUrl);

    if (match && typeof match === "string") {
      const middlewaresAndControllers = this.router.getRoutes().get(match);
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
