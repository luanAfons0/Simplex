import { Inject } from "../../../dependency-injection/index.js";
import UserService from "../services/user-service.js";
import { Response } from "../../../http/response.js";
import { Request } from "../../../http/request.js";
import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Put,
} from "../../../routing/decorators-router.js";

@Controller("/users")
class UserController {
  public static lastId: number = 0;
  public static users: Array<{
    id: number;
    name: string;
  }> = [];

  @Inject(UserService)
  private readonly userService: UserService;

  @Post()
  public CreateUser(req: Request, res: Response) {
    const createdUser = this.userService.create({ name: req.body.user.name });

    res.sendJson({
      statusCode: 200,
      data: {
        message: "User created successfully!",
        content: createdUser,
      },
    });
  }

  @Get({
    middlewares: [
      (_: Request, __: Response, next: Function) => {
        console.log("middleware example here!");
        next();
      },
    ],
  })
  public GetAllUsers(_: Request, res: Response) {
    const allUsers = this.userService.getAll();

    res.sendJson({
      statusCode: 200,
      data: allUsers,
    });
  }

  @Get({ routePath: "/:id" })
  public GetUserById(req: Request, res: Response) {
    const userFound = this.userService.getById(Number(req.pathParams.id));

    if (!userFound) {
      return res.sendJson({
        statusCode: 404,
        data: {
          message: "User was not found",
        },
      });
    }

    return res.sendJson({
      statusCode: 200,
      data: userFound,
    });
  }

  @Put({ routePath: "/:id" })
  public UpdateUser(req: Request, res: Response) {
    const userFound = this.userService.getById(Number(req.pathParams.id));

    if (!userFound) {
      return res.sendJson({
        statusCode: 404,
        data: {
          message: "User was not found",
        },
      });
    }

    const updatedUser = this.userService.updateUser({
      id: req.body.user.newId,
      name: req.body.user.newName,
    });

    return res.sendJson({
      statusCode: 200,
      data: updatedUser,
    });
  }

  @Patch({ routePath: "/:id" })
  public PatchUserName(req: Request, res: Response) {
    const userFound = this.userService.getById(Number(req.pathParams.id));

    if (!userFound) {
      return res.sendJson({
        statusCode: 404,
        data: {
          message: "User was not found",
        },
      });
    }

    const updatedUser = this.userService.updateUserName({
      ...userFound,
      name: req.body.user.newName,
    });

    return res.sendJson({
      statusCode: 200,
      data: updatedUser,
    });
  }

  @Delete({ routePath: "/:id" })
  public DeleteUser(req: Request, res: Response) {
    const userFound = this.userService.getById(Number(req.pathParams.id));

    if (!userFound) {
      return res.sendJson({
        statusCode: 404,
        data: {
          message: "User was not found",
        },
      });
    }

    const deletedUser = this.userService.deleteUser(userFound.id);

    return res.sendJson({
      statusCode: 200,
      data: deletedUser,
    });
  }
}

export default UserController;
