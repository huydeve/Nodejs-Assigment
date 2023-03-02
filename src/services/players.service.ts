import { Model, PopulateOptions } from "mongoose";
import Players, { IPlayer } from "../models/players.mongo";
import { PlayerQuery } from "../types/nationQuery";
import { getPagination, getPaginationDetails, queryModel } from "../utils/query";

class PlayersService {













  async getAllPlayers(query: PlayerQuery) {


    const { skip, limit, page } = getPagination({
      limit: query.limit,
      page: query.page,
    });
    const mongoQuery: any = {
      $or: [
        { name: { $regex: query.searchValue || '', $options: 'i' } },
        { club: { $regex: query.searchValue || '', $options: 'i' } },
        { position: { $regex: query.searchValue || '', $options: 'i' } },
      ],
    };
    if (typeof query.isCaptain !== 'undefined') mongoQuery.isCaptain = query.isCaptain;



    const data = await queryModel<IPlayer>(Players, mongoQuery, skip, limit, 'nation', {
      path: 'nation',
      match: { name: { $regex: query.searchValue || '', $options: 'i' } },
    })



    return {
      players: data.models,
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
