import { generatePathParams, routeMatch } from "./utils/pathFormatter.js";
import { Response } from "./http/response.js";
import { Request } from "./http/request.js";
import http, { Server } from "http";
import { dirname, format, resolve } from "path";
import fs from "fs";

class Simplex {
  public server: Server;
  private appRoutes: Map<string, Array<Function>> = new Map<
    string,
    Array<Function>
  >();
  private customErrorTreatment: (
    req: Request,
    res: Response,
    error: Error,
  ) => void | null;
  private customNotFoundTreatment: (req: Request, res: Response) => void | null;
  private staticFolderPath: string | null = null;

  constructor(customObj?: {
    customNotFoundTreatment?: (req: Request, res: Response) => void;
    customErrorTreatment?: (
      req: Request,
      response: Response,
      error: Error,
    ) => void;
  }) {
    if (customObj?.customErrorTreatment) {
      this.customErrorTreatment = customObj.customErrorTreatment;
    }

    if (customObj?.customNotFoundTreatment) {
      this.customNotFoundTreatment = customObj.customNotFoundTreatment;
    }
  }

  public setAppRoutes = (routes: Map<string, Array<Function>>): void => {
    this.appRoutes = routes;
  };

  public mergeMultipleRouters(
    ...routerMaps: Array<Map<string, Array<Function>>>
  ) {
    let formatedMap = new Map<string, Array<Function>>();

    routerMaps.forEach((mapToMerge) => {
      mapToMerge.forEach((key, value) => {
        formatedMap.set(value, key);
      });
    });

    this.appRoutes = formatedMap;
  }

  public init = (): void => {
    this.server = http.createServer(async (req, res) => {
      if (req.url && this.staticFolderPath) {
        if (this.checkFileIsStatic(req.url)) {
          const fileBuffer = this.findStaticFile(req.url);

          if (fileBuffer) {
            res.writeHead(200);
            res.end(fileBuffer);
            return;
          }
        }
      }

      const formatedUrl = this.formatRequestPath(req.url, req.method);

      let request: Request = await new Request().setupRequest(req);
      let response: Response = new Response(res);

      if (!formatedUrl) {
        return response.sendJson({
          statusCode: 400,
          data: {
            message:
              "There was an error in your URL or METHOD, please check and try again",
          },
        });
      }

      let routeKey: string = "";

      for (var key of this.appRoutes.keys()) {
        if (!req.method) return;

        const routeMatched = routeMatch({
          value: formatedUrl,
          valueToCompare: key,
          method: req.method,
        });

        if (routeMatched) {
          routeKey = key;
          break;
        }
      }

      const functionsList = this.appRoutes.get(routeKey);

      const formatedPathParams = generatePathParams({
        value: formatedUrl,
        valueToCompare: routeKey,
      });

      request.pathParams = formatedPathParams;

      if (!functionsList) {
        if (this.customNotFoundTreatment) {
          return this.customNotFoundTreatment(request, response);
        }

        return response.sendJson({
          statusCode: 404,
          data: {
            message: "The provided route was not found",
          },
        });
      }

      this.applyChainOfResponsability(request, response, functionsList);
    });
  };

  private formatRequestPath = (
    path: string | undefined,
    method: string | undefined,
  ): string | undefined => {
    if (!path) return;

    const hasParams = path.indexOf("?");

    if (hasParams != -1) {
      path = path.slice(0, hasParams);
    }

    return `${method} ${path}`;
  };

  private applyChainOfResponsability = async (
    request: Request,
    response: Response,
    functions: Array<Function>,
  ) => {
    let index: number = 0;

    let customErrorTreatment = this.customErrorTreatment;
    let customNotFoundTreatment = this.customNotFoundTreatment;

    function next(error?: Error) {
      if (error) {
        if (customErrorTreatment) {
          return customErrorTreatment(request, response, error);
        }

        return response.sendJson({
          statusCode: 500,
          data: {
            message: "An unexpected error occurred, please try again",
          },
        });
      }

      if (index >= functions.length) {
        if (!response.headersSent()) {
          if (customNotFoundTreatment) {
            customNotFoundTreatment(request, response);
            return;
          }

          response.sendJson({
            statusCode: 404,
            data: {
              message: "The provided route was not found",
            },
          });
        }
      }

      const currentFunction = functions[index];
      index++;

      try {
        if (!currentFunction) {
          throw new Error("Error during current function call");
        }

        currentFunction(request, response, next);
      } catch (error) {
        next(error as Error);
      }
    }

    next();
  };

  public setStaticFolder(staticFolderPath: string): void {
    this.staticFolderPath = staticFolderPath;
  }

  private checkFileIsStatic = (path: string): boolean => {
    if (/\.[a-z0-9]+$/.test(path)) {
      return true;
    }

    return false;
  };

  private findStaticFile = (path: string): Buffer | undefined => {
    const bufferData: Buffer | undefined = fs.readFileSync(
      resolve(`${process.cwd()}${this.staticFolderPath}${path}`),
    );

    return bufferData;
  };
}

export default Simplex;
