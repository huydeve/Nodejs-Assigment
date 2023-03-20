import Nations, { INation } from "../models/nations.mongo";
import { NationQuery } from "../types/nationQuery";
import { getPagination, getPaginationDetails, queryModel } from "../utils/query";
class NationsService {
  async getAllNations(query: NationQuery, getFull?: boolean) {


    const { skip, limit, page } = getPagination({
      limit: query.limit,
      page: query.page,
    });



    const mongoQuery = {
      $or: [
        { name: { $regex: query.q || '', $options: 'i' } },
      ],
    };

    const data = await queryModel(Nations, mongoQuery, skip, limit)


    return {
      nations: data.models, ...getPaginationDetails(data.count, limit, page)
    }
  }
  
  async getNation(id: string) {
    return await Nations.findById(id, { __v: 0 });
  }

  async insertNation(nation: INation) {
    return await Nations.create(
      nation,
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
