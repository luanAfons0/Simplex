// Dependency injection related
export { initDIContainer, Inject, Injectable } from "./dependency-injection/index.js"

// HTTP related exports
export type { Request } from "./http/request.js";
export type { Response } from "./http/response.js";

// Routing related exports
export { Router } from "./routing/router.js";
export {
  appRoutes,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
} from "./routing/decorators-router.js";

// Project main file
export { Simplex } from "./simplex.js";
