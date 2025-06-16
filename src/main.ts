import { App } from "./framework/app.js";

const app = new App();

app.router.get("/health-check", () => {
  console.log("API is running!");
});

app.router.get(
  "/hello-world",
  (_, __, next) => {
    console.log("Example middleware here");
    next();
  },
  (req, res) => {
    console.log("HELLO WORLD");
  }
);

app.run("3000", () => {
  console.log("API is up and running on port 3000");
});
