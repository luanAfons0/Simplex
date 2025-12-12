
import { Response } from "../../http/response.js";
import { Router } from "../../routing/router.js";
import { Request } from "../../http/request.js";
import { Simplex } from "../../simplex.js";

const app = new Simplex({
  customNotFoundTreatment: (req, res) => {
    res.sendJson({
      statusCode: 404,
      data: {
        message: "The provided route was not found",
        route: req.path,
      },
    });
  },
  customErrorTreatment: (_, res, error) => {
    res.sendJson({
      statusCode: 500,
      data: {
        message: "An unexpected error occurred, please try again",
        error: error.message,
      },
    });
  },
});

const router = new Router();

router.get("/", (_: Request, res: Response) => {
  res.sendHtml({ statusCode: 200, data: "<h1>Home page here</h1>" });
});

router.get(
  "/test/:id",
  (_: Request, __: Response, next: Function) => {
    console.log("Called first function");
    next();
  },
  (req: Request, res: Response) => {
    console.log("Called second function");

    console.log({
      pathParams: req.pathParams,
    });

    res.sendHtml({
      statusCode: 200,
      data: "<h1>Success in request<h1>",
    });
  },
);

router.post("/test", (_: Request, res: Response) => {
  console.log("Called post route");

  res.sendHtml({ statusCode: 200, data: "<h1>Success in request</h1>" });
});

router.get("/json-example", (_: Request, res: Response) => {
  res.sendJson({
    statusCode: 200,
    data: {
      message: "Example of JSON message",
    },
  });
});

app.setAppRoutes(router.getRoutes());

app.init();

app.server.listen(3000, "localhost", () => {
  console.log("API is up and running on port 3000");
});
