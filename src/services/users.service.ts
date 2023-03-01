import { hashPassword } from "../configs/bcrypt.config";
import Users, { IUser } from "../models/user.mongo";


class UsersService {

  async getAllUsers(skip: number, limit: number, name: string | undefined) {
    const query = name
      ? { name: { $regex: new RegExp(`.*${name}.*`, "i") } }
      : {};

    return await Users.find(query, { __v: 0 }).skip(skip).limit(limit);
  }

  async getUser(email: string) {
    return await Users.findOne({
      email,
    });
  }

  async getUserById(id: string) {
    return await Users.findById(id);
  }

  async createUser(user: IUser) {

    user.password = await hashPassword(user.password)

    return await Users.create(user);
  }
  async updateUserById(id: string, user: IUser) {


    return await Users.findByIdAndUpdate(id, {
      email: user.email,
      name: user.name,
      yob: user.yob,
    });
  }

  async updateUserPassword(id: string, password: string) {

    return await Users.findByIdAndUpdate(id, {
      password: await hashPassword(password)
    })
  }
}

export default UsersService;
