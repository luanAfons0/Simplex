import { type ServerResponse } from "http";

class Response {
  private readonly res: ServerResponse;

  constructor(res: ServerResponse) {
    this.res = res;
  }

  public headersSent = (): boolean => {
    return this.res.headersSent;
  };

  public sendJson = ({
    statusCode,
    data,
  }: {
    data: any;
    statusCode: number;
  }): void => {
    this.res.writeHead(statusCode, {
      "Content-Type": "application/json",
      "X-Powered-By": "Node.js",
    });

    this.res.end(JSON.stringify(data));
  };

  public sendHtml = ({
    statusCode,
    data,
  }: {
    data: any;
    statusCode: number;
  }): void => {
    this.res.writeHead(statusCode, {
      "Content-Type": "text/html",
      "X-Powered-By": "Node.js",
    });

    this.res.end(String(data));
  };

  public sendText = ({
    statusCode,
    data,
  }: {
    data: any;
    statusCode: number;
  }): void => {
    this.res.writeHead(statusCode, {
      "Content-Type": "text/plain",
      "X-Powered-By": "Node.js",
    });

    this.res.end(String(data));
  };

  public appendHeader = ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }): Response => {
    this.res.appendHeader(key, value);
    return this;
  };

  public removeHeader = ({ key }: { key: string }): Response => {
    this.res.removeHeader(key);
    return this;
  };
}

export { Response };
