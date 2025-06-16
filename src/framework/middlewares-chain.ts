import { ServerResponse } from "http";

export class MiddlewaresChain {
  public dispatchChain = (
    request: Request,
    response: ServerResponse,
    middlewares: Function[]
  ): Promise<Function | undefined> => {
    return this.invokeMiddlewares(request, response, middlewares);
  };

  public invokeMiddlewares = async (
    request: Request,
    response: ServerResponse,
    middlewares: Function[]
  ): Promise<Function | undefined> => {
    if (!middlewares.length) return;

    const currentMiddleware = middlewares[0];

    return currentMiddleware(request, response, async () => {
      await this.invokeMiddlewares(request, response, middlewares.slice(1));
    });
  };
}
