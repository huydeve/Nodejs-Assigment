import { hashPassword } from "../configs/bcrypt.config";
import Users, { IUser } from "../models/user.mongo";
import { UserQuery } from "../types/nationQuery";
import { getPagination, getPaginationDetails, queryModel } from "../utils/query";


class UsersService {

  async getAllUsers(query: UserQuery) {
    // const query = name
    //   ? { name: { $regex: new RegExp(`.*${name}.*`, "i") } }
    //   : {};

    const { skip, limit, page } = getPagination({
      limit: query.limit,
      page: query.page,
    });


    const mongoQuery = {
      $or: [
        { name: { $regex: query.searchValue || '', $options: 'i' } },
        { email: { $regex: query.searchValue || '', $options: 'i' } },
      ],
    };

    const { count, models } = await queryModel(Users, mongoQuery, skip, limit)

    return {
      users: models, ...getPaginationDetails(count, limit, page)
    }
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
