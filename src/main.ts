import { App } from "./framework/app.js";

const app = new App();

app.router.get(
  "/hello-world/:id",
  (_, __, next: Function) => {
    console.log("Example middleware here");
    next();
  },
  (req, res) => {
    console.log(req.params);

    res.status(200).json({ message: "teste" });
  }
);

app.run("3000", () => {
  console.log("API is up and running on port 3000");
});
