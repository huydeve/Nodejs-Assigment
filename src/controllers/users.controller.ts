import { NextFunction, Request, Response } from "express";
import { getPagination } from "../utils/query";
import { Query } from "../types/nationQuery";
import UsersDAO from "../services/users.service";
import { IUser } from "../models/user.mongo";
import UsersService from "../services/users.service";



class UsersController {
  async httpGetOwnInfoUser(req:Request, res:Response){

  } 

async httpGetAllUsers(req: Request, res: Response, next: NextFunction) {
  const userDao = new UsersService();
  try {
    const query = req.query as unknown as Query;
    const user = req.session.passport.user.profile.email
    const data = await userDao.getAllUsers(query,user);
    const URL = req.originalUrl.split("?")[0]
    
    return res.render("component/user-row.ejs", {
      q:query.q,
      errorMessage: req.flash('error'),
      ...data,
      URL
    });
  } catch (error) {
    if (error instanceof Error) res.send(error.message);
  }
}
async httpGetUser (req:Request, res:Response){

}

async httpUpdateUser (req:Request, res:Response){

}

async httpCreateUser(req:Request, res:Response){

}
}

export default UsersController;
