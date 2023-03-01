import Players, { IPlayer } from "../models/players.mongo";

class PlayersService {
  async getAllPlayers(skip: number, limit: number, name: string | undefined, isCaptain: boolean | undefined) {
    let query: any = {}


    if (name) query.name = { $regex: new RegExp(`.*${name}.*`, "i") }
    
    if (typeof isCaptain === "boolean") query.isCaptain = isCaptain
    console.log(query);

    return await Players.find({
      ...query
    }, { __v: 0 }).skip(skip).limit(limit).populate('nation');
  }

  async getPlayer(id: string) {
    return await Players.findById(id, { __v: 0 }).populate('nation');
  }

  async insertPlayer(player: IPlayer) {


    return await Players.findOneAndUpdate(
      {
        name: player.name,
      },
      player,
      {
        upsert: true,
      }
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
