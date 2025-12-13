import { initDIContainer } from "../../dependency-injection/index.js";
import { appRoutes } from "../../routing/decorators-router.js";
import { Simplex } from "../../simplex.js";
import UserService from "./services/user-service.js";

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

initDIContainer([UserService]);

app.autoLoad("**/**-controller.js");

app.setAppRoutes(appRoutes);

app.init();

app.server.listen(3000, "localhost", () => {
  console.log("API is up and running on port 3000");
});
