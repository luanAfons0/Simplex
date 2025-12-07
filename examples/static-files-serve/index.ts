import { Router, Simplex, Request, Response } from "simplex-api";

const app = new Simplex();
const router = new Router();

router.get("/", (_: Request, res: Response) => {
  res.sendHtml({ statusCode: 200, data: "<h1>Home page here</h1>" });
});

app.setAppRoutes(router.getRoutes());

app.setStaticFolder("/static-files-serve/public");

app.init();

app.server.listen(3000, "localhost", () => {
  console.log("API is up and running on port 3000");
});
