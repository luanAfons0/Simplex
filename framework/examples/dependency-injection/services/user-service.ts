import { Injectable } from "../../../dependency-injection/index.js";

type User = {
  id: number;
  name: string;
};

@Injectable()
class UserService {
  public static lastId: number = 0;
  public static users: Array<User> = [];

  public create = (userToCreate: Omit<User, "id">): User => {
    UserService.lastId = UserService.lastId + 1;

    UserService.users.push({
      ...userToCreate,
      id: UserService.lastId,
    });

    return {
      ...userToCreate,
      id: UserService.lastId,
    };
  };

  public getAll = (): Array<User> => {
    return UserService.users;
  };

  public getById = (id: number): undefined | User => {
    const user = UserService.users.find((entity) => entity.id == id);

    if (user) return user;

    return undefined;
  };

  public updateUser = (user: User): undefined | User => {
    const userFound = this.getById(user.id);

    if (!userFound) return;

    const indexOfUser = UserService.users.indexOf(userFound);

    UserService.users[indexOfUser] = user;

    return user;
  };

  public updateUserName = (user: User): undefined | User => {
    const userFound = this.getById(user.id);

    if (!userFound) return;

    const indexOfUser = UserService.users.indexOf(userFound);

    UserService.users[indexOfUser] = { ...userFound, name: user.name };

    return user;
  };

  public deleteUser = (id: number): User | undefined => {
    const userFound = this.getById(id);

    if (!userFound) return undefined;

    UserService.users = UserService.users.filter((entity) => entity.id != id);

    return userFound;
  };
}

export default UserService;
