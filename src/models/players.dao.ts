import PlayersDTO from "./Players.dto";
import Players from "./players.mongo";

class PlayersDAO {
  async getAllPlayers(skip: number, limit: number, name: string | undefined) {
    const query = name
      ? { name: { $regex: new RegExp(`.*${name}.*`, "i") } }
      : {};

    return await Players.find(query, { __v: 0 }).skip(skip).limit(limit);
  }

  async getPlayer(id: string) {
    return await Players.findById(id, { __v: 0 });
  }

  async insertPlayer(player: PlayersDTO) {
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

  async updatePlayer(id: string, Player: PlayersDTO) {
    return await Players.findByIdAndUpdate(id, Player, { new: true });
  }

  async deletePlayer(id: string) {
    return await Players.findByIdAndRemove(id);
  }
}

export default PlayersDAO;
