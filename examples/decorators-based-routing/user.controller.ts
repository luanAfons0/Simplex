import { Request, Response,Controller, Delete, Get, Patch, Post, Put } from "simplex-api";

@Controller("/users")
class UserController {
  public static lastId: number = 0;
  public static users: Array<{
    id: number;
    name: string;
  }> = [];

  @Post()
  public CreateUser(req: Request, res: Response) {
    UserController.lastId = UserController.lastId + 1;

    const createdUser = {
      id: UserController.lastId,
      name: req.body.user.name,
    };

    UserController.users.push(createdUser);

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
    res.sendJson({
      statusCode: 200,
      data: UserController.users,
    });
  }

  @Get({ routePath: "/:id" })
  public GetUserById(req: Request, res: Response) {
    const userFound = UserController.users.find(
      (user) => user.id == Number(req.pathParams.id),
    );

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
    const userFound = UserController.users.find(
      (user) => user.id == Number(req.pathParams.id),
    );

    if (!userFound) {
      return res.sendJson({
        statusCode: 404,
        data: {
          message: "User was not found",
        },
      });
    }

    const userIndex = UserController.users.indexOf(userFound);

    UserController.users[userIndex] = {
      id: req.body.user.newId,
      name: req.body.user.newName,
    };

    return res.sendJson({
      statusCode: 200,
      data: UserController.users[userIndex],
    });
  }

  @Patch({ routePath: "/:id" })
  public PatchUserName(req: Request, res: Response) {
    const userFound = UserController.users.find(
      (user) => user.id == Number(req.pathParams.id),
    );

    if (!userFound) {
      return res.sendJson({
        statusCode: 404,
        data: {
          message: "User was not found",
        },
      });
    }

    const userIndex = UserController.users.indexOf(userFound);

    UserController.users[userIndex] = {
      id: userFound.id,
      name: req.body.user.newName,
    };

    return res.sendJson({
      statusCode: 200,
      data: UserController.users[userIndex],
    });
  }

  @Delete({ routePath: "/:id" })
  public DeleteUser(req: Request, res: Response) {
    const userFound = UserController.users.find(
      (user) => user.id == Number(req.pathParams.id),
    );

    if (!userFound) {
      return res.sendJson({
        statusCode: 404,
        data: {
          message: "User was not found",
        },
      });
    }

    UserController.users = UserController.users.filter(
      (user) => user.id != userFound.id,
    );

    return res.sendJson({
      statusCode: 200,
      data: userFound,
    });
  }
}

export default UserController;
