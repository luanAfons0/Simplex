import { IncomingMessage, ServerResponse } from "http";

export type NextFunction = () => void;

export type Request = IncomingMessage & {
  params: any;
  url: string;
  query: Object;
};

export type Response = ServerResponse & {
  status: (data: any) => Response;
  json: (data: any) => void;
  send: (data: any) => void;
};
