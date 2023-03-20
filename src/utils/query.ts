import { Model } from "mongoose";
import { Query } from "../types/nationQuery";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 5;
const DEFAULT_LIMITS = [5, 10, 15, 300]
function getPagination(query: Query) {


  const page = query.page ? Math.abs(query.page) : DEFAULT_PAGE_NUMBER;
  const limit = query.limit ? Math.abs(query.limit) : DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;


  return {
    skip,
    limit,
    page
  };
}

export function getPaginationDetails(count: number, limit: number, page: number) {

  const totalPage = Math.ceil(count / limit);
  const currentPage = page;
  const start = currentPage > 2 ? currentPage - 2 : 1;
  const end = currentPage < totalPage - 2 ? currentPage + 2 : totalPage;
  const ellipsisStart = currentPage > 3 && totalPage > 5;
  const ellipsisEnd = currentPage < totalPage - 2 && totalPage > 5;

  return {
    totalPage, currentPage, start, end, ellipsisStart, ellipsisEnd, limit
  }
}



async function queryModel<T>(model: Model<T>, mongoQuery: any, skip: number, limit: number, sortObject: any = {}, populate?: any,
  populateOptions?: any) {
  if (!DEFAULT_LIMITS.includes(limit)) limit = 5

  console.log(sortObject);

  function myModel() {
    return {
      countQuery: model.countDocuments(mongoQuery),
      modelQuery: model.find(mongoQuery, { __v: 0 }).skip(skip).limit(limit)
    }
  }


  let models: T[] = [];
  let count = 0
  if (populate && populateOptions) {
    count = await myModel().countQuery.populate(populate).sort(sortObject)
    models = await myModel().modelQuery.populate(populate).sort(sortObject)
    if (models.length == 0) {

      count = await myModel().countQuery.populate(populateOptions).sort(sortObject)
      models = await myModel().modelQuery.populate(populateOptions).sort(sortObject)
    }

  } else {
    count = await myModel().countQuery.sort(sortObject)
    models = await myModel().modelQuery.sort(sortObject)
  }




  return { count, models };
}

export { getPagination, queryModel };
