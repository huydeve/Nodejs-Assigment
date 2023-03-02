import { INation } from "../models/nations.mongo";
import { IPlayer } from "../models/players.mongo";
import { IUser } from "../models/user.mongo";

export interface Query {
  page?: number;
  limit?: number;
  searchValue?: string;
}



export interface PlayerQuery extends Partial<Query>, Partial<IPlayer> {

}
export interface NationQuery extends Partial<Query>, Partial<INation> {

}

export interface UserQuery extends Partial<Query>, Partial<IUser> {

}