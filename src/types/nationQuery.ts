import { INation } from "../models/nations.mongo";
import { IPlayer } from "../models/players.mongo";
import { IUser } from "../models/user.mongo";

export interface Query {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  sortType?: string;
}



export interface PlayerQuery extends Partial<Query>, Partial<IPlayer> {
  positions?: string[],
  nations?: string[],
  clubs?: string[],
  goalsRange?: string[]
}
export interface NationQuery extends Partial<Query>, Partial<INation> {

}

export interface UserQuery extends Partial<Query>, Partial<IUser> {
  ageRange?: string[]
}