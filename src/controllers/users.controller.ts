import { NextFunction, Request, Response } from "express";
import { getPagination } from "../utils/query";
import { Query } from "../types/nationQuery";
import UsersDAO from "../services/users.service";
import { IUser } from "../models/user.mongo";


var positions = [
  "Goalkeeper",
  "Right Back",
  "Center Back",
  "Left Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Right Winger",
  "Left Winger",
  "Striker",
];
var clubs = [
  "Manchester United",
  "Barcelona",
  "Real Madrid",
  "Bayern Munich",
  "Paris Saint-Germain",
  "Chelsea",
  "Liverpool",
  "Juventus",
  "Manchester City",
  "Arsenal",
];

class UsersController {
  async httpGetOwnInfoUser(req:Request, res:Response){

  } 
async httpGetAllUsers (req:Request, res:Response){

}

async httpGetUser (req:Request, res:Response){

}

async httpUpdateUser (req:Request, res:Response){

}

async httpCreateUser(req:Request, res:Response){

}
}

export default UsersController;
