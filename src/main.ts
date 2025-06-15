import { App } from "./index.js";

const app = new App();

app.get("/health-check", () => {
  console.log("API is running!");
});

app.get("/hello-world", () => {
  console.log("HELLO WORLD");
});

app.run("3000", () => {
  console.log("API is up and running on port 3000");
});
