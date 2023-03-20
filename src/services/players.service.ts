import { Model, PopulateOptions } from "mongoose";
import Players, { IPlayer } from "../models/players.mongo";
import { PlayerQuery } from "../types/nationQuery";
import { getPagination, getPaginationDetails, queryModel } from "../utils/query";
import { type } from "os";

class PlayersService {













  async getAllPlayers(query: PlayerQuery) {

    const sortObject: any = {}
    const { skip, limit, page } = getPagination({
      limit: query.limit,
      page: query.page,
    });
    const mongoQuery: any = {

    };

    if (query.q) {
      mongoQuery.$or = [
        { name: { $regex: query.q, $options: 'i' } },
        { club: { $regex: query.q, $options: 'i' } },
        { position: { $regex: query.q, $options: 'i' } },
        { career: { $regex: query.q, $options: 'i' } },
      ]
      if (Number(query.q)) {
        mongoQuery.$or[mongoQuery.$or.length - 1] = { goals: Number(query.q) }

      }
    }

    if (query.sortType && query.sortBy) {
      sortObject[`${query.sortBy}`] = Number(query.sortType)
    }

    if (typeof query.goalsRange !== 'undefined' && query.goalsRange.length >= 2) {
      mongoQuery.goals = { $gte: Number(query.goalsRange[0]), $lte: query.goalsRange[1] }
    }
    if (typeof query.clubs !== "undefined" && query.clubs.length > 0) {
      mongoQuery.club = { $in: query.clubs }
    }
    if (typeof query.positions !== "undefined" && query.positions.length > 0) {
      mongoQuery.position = { $in: query.positions }
    }

    if (typeof query.nations !== "undefined" && query.nations.length > 0) {
      mongoQuery.nation = { $in: query.nations }
    }

    if (typeof query.isCaptain !== 'undefined') mongoQuery.isCaptain = query.isCaptain;


    const data = await queryModel<IPlayer>(Players, mongoQuery, skip, limit, sortObject, 'nation', {
      path: 'nation',
      match: { name: { $regex: query.q || '', $options: 'i' } },
    })

    return {
      players: data.models,
      maxDefault: query.goalsRange ? query.goalsRange[1] : 0,
      ...getPaginationDetails(data.count, limit, page)
    };
  }

  async getPlayer(id: string) {
    return await Players.findById(id, { __v: 0 }).populate('nation');
  }

  async insertPlayer(player: IPlayer) {

    return await Players.create(
      player,
    );
  }

  async updatePlayer(id: string, Player: IPlayer) {

    return await Players.findByIdAndUpdate(id, Player, {
      upsert: true,
    });
  }

  async deletePlayer(id: string) {
    return await Players.findByIdAndRemove(id);
  }
}

export default PlayersService;
