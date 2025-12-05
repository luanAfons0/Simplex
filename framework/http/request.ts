import { getRecordFromString } from "../utils/getRecordFromString.js";
import type { IncomingMessage } from "http";

class Request {
  public url: string;
  public path: string;
  public pathParams: Record<string, any> = {};
  public params: Record<string, any> = {};
  public headers: Record<string, any> = {};
  public cookies: Record<string, any> = {};
  public body: any;

  public setupRequest = async (req: IncomingMessage): Promise<Request> => {
    this.url = req.url ?? "";
    this.headers = req.headers;

    this.setUpCookies(req);
    this.setUpHeaders(req);
    await this.setUpBody(req);
    this.setUpPath();
    this.setUpParams();
    return this;
  };

  private setUpBody = async (req: IncomingMessage): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      let body: string = "";

      req.on("data", (chunk: string) => {
        body += chunk;
      });

      req.on("end", () => {
        const contentType = this.headers["content-type"] as string;

        if ((contentType ?? "").toLowerCase().includes("json")) {
          body = JSON.parse(body);
        }

        this.body = body;
        resolve();
      });

      req.on("error", (error) => {
        reject(error);
      });
    });
  };

  private setUpCookies = (req: IncomingMessage): void => {
    if (req.headers.cookie == "" || !req.headers.cookie) return;

    const result = getRecordFromString({
      value: req.headers.cookie,
      contentSplitSymbol: ";",
      keyValueSplitSymbol: "=",
    });

    this.cookies = result;
  };

  private setUpHeaders = (req: IncomingMessage): void => {
    const formatedHeaders = req.headers;

    if (formatedHeaders.cookie) {
      delete formatedHeaders.cookie;
    }

    this.headers = formatedHeaders;
  };

  private setUpPath = ():void => {
    const hasParams = this.url.indexOf("?");

    if (hasParams != -1) {
      this.path = this.url.slice(0, hasParams);
      return;
    }

    this.path = this.url;
  };

  private setUpParams = (): void => {
    const hasParams = this.url.indexOf("?");

    if (hasParams == -1) return;

    const allParamsString = this.url.slice(hasParams + 1, this.url.length);

    const result = getRecordFromString({
      value: allParamsString,
      contentSplitSymbol: "&",
      keyValueSplitSymbol: "=",
    });

    this.params = result;
  };
}

export { Request };
