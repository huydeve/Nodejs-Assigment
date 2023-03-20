import moment from "moment";
import { hashPassword } from "../configs/bcrypt.config";
import Users, { IUser } from "../models/user.mongo";
import { UserQuery } from "../types/nationQuery";
import { getPagination, getPaginationDetails, queryModel } from "../utils/query";


class UsersService {

  async getAllUsers(query: UserQuery, userEmail: string) {
    // const query = name
    //   ? { name: { $regex: new RegExp(`.*${name}.*`, "i") } }
    //   : {};
    const { skip, limit, page } = getPagination({
      limit: query.limit,
      page: query.page,
    });

    const sortObject: any = {}
    const mongoQuery: any = {
      email: { $not: { $regex: userEmail, $options: 'i' } },
      $or: [
        { name: { $regex: query.q || '', $options: 'i' } },
        { email: { $regex: query.q || '', $options: 'i' } },
      ],
    };
    console.log(query.isAdmin);
    if (query.sortType && query.sortBy) {
      sortObject[`${query.sortBy}`] = Number(query.sortType)
    }

    if (typeof query.isAdmin !== 'undefined') {
      mongoQuery.isAdmin = query.isAdmin
    }

    if (typeof query.ageRange !== 'undefined' && query.ageRange.length > 0) {
      console.log(new Date(new Date().getFullYear() - (Number(query.ageRange[0]), 0, 1)));
      const startAge = (Number(query.ageRange[0])); // Start age of range
      const endAge = (Number(query.ageRange[1])); // End age of range
      console.log(startAge, endAge);

      const startDOB = new Date(new Date().setFullYear(new Date().getFullYear() - endAge)); // Calculate start date of range
      const endDOB = new Date(new Date().setFullYear(new Date().getFullYear() - startAge)); // Calculate end date of range
      mongoQuery.yob = {
        $lte: endDOB,
        $gte: startDOB
      }

    }

    const { count, models } = await queryModel(Users, mongoQuery, skip, limit, sortObject)

    return {
      users: models, ...getPaginationDetails(count, limit, page)
    }
  }

  async getUser(value: string) {
    return await Users.findOne({ $or: [{ email: value }, { phone: value }] });
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
      phone: user.phone
    });
  }

  async updateUserPassword(id: string, password: string) {

    return await Users.findByIdAndUpdate(id, {
      password: await hashPassword(password)
    })
  }

  async updateUserPasswordByOr(verifyBy: string, password: string) {
    console.log(verifyBy);

    return await Users.findOneAndUpdate({ $or: [{ email: verifyBy }, { phone: verifyBy }] }, {
      password: await hashPassword(password)
    }, { new: true },
    )
  }
}

export default UsersService;
