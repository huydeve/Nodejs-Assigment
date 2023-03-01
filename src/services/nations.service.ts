import Nations, { INation } from "../models/nations.mongo";
class NationsService {
  async getAllNations(skip: number, limit: number, name: string | undefined) {
    const query = name
      ? { name: { $regex: new RegExp(`.*${name}.*`, "i") } }
      : {
        
      };

    return await Nations.find(query, { __v: 0 }).skip(skip).limit(limit);
  }

  async getNation(id: string) {
    return await Nations.findById(id, { __v: 0 });
  }

  async insertNation(nation: INation) {
    return await Nations.findOneAndUpdate(
      {
        name: nation.name,
      },
      nation,
      {
        upsert: true,
      }
    );
  }

  async updateNation(id: string, nation: INation) {
    return await Nations.findByIdAndUpdate(id, nation, { new: true });
  }

  async deleteNation(id: string) {
    return await Nations.findByIdAndRemove(id);
  }
}

export default NationsService;
