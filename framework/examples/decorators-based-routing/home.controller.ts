import { Controller, Get } from "../../routing/decorators-router.js";
import { Response } from "../../http/response.js";
import { Request } from "../../http/request.js";

@Controller("/")
class HomeController {
  @Get({
    middlewares: [
      (_: Request, __: Response, next: Function) => {
        console.log("accessed the home route!");
        next();
      },
    ],
  })
  public GetHome(_: Request, res: Response) {
    res.sendHtml({
      statusCode: 200,
      data: "<h1>Home route here</h1>",
    });
  }
}

export default HomeController;
