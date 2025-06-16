import { createServer, Server, ServerResponse } from "http";

import { MiddlewaresChain } from "./middlewares-chain.js";
import { Router } from "./router.js";

export class App {
  private server: Server;
  private middlewaresChain: MiddlewaresChain;
  public router: Router;

  constructor() {
    this.server = this.createMyServer();
    this.router = new Router();
    this.middlewaresChain = new MiddlewaresChain();
  }

  private createMyServer(): Server {
    return createServer(this.serverHandler.bind(this));
  }

  private serverHandler = async (
    request: Request,
    response: ServerResponse
  ): Promise<void> => {
    const sanitizedUrl = this.router.sanitizeUrl(request.url, request.method);
    const match = this.router.matchUrl(sanitizedUrl);

    if (match && typeof match === "string") {
      const middlewaresAndControllers = this.router.getRoutes().get(match);

      if (middlewaresAndControllers)
        await this.middlewaresChain.dispatchChain(request, response, [
          ...middlewaresAndControllers,
        ]);
    } else {
      response.statusCode = 404;
      response.end("Not found");
    }
  };

  public run = (port: string, extraFunction?: Function): void => {
    this.server.listen(port);
    if (extraFunction) extraFunction();
  };
}
