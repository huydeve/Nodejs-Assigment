"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryModel = exports.getPagination = exports.getPaginationDetails = void 0;
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 5;
const DEFAULT_LIMITS = [5, 10, 15, 300];
function getPagination(query) {
    const page = query.page ? Math.abs(query.page) : DEFAULT_PAGE_NUMBER;
    const limit = query.limit ? Math.abs(query.limit) : DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;
    return {
        skip,
        limit,
        page
    };
}
exports.getPagination = getPagination;
function getPaginationDetails(count, limit, page) {
    const totalPage = Math.ceil(count / limit);
    const currentPage = page;
    const start = currentPage > 2 ? currentPage - 2 : 1;
    const end = currentPage < totalPage - 2 ? currentPage + 2 : totalPage;
    const ellipsisStart = currentPage > 3 && totalPage > 5;
    const ellipsisEnd = currentPage < totalPage - 2 && totalPage > 5;
    return {
        totalPage, currentPage, start, end, ellipsisStart, ellipsisEnd, limit
    };
}
exports.getPaginationDetails = getPaginationDetails;
function queryModel(model, mongoQuery, skip, limit, sortObject = {}, populate, populateOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!DEFAULT_LIMITS.includes(limit))
            limit = 5;
        console.log(sortObject);
        function myModel() {
            return {
                countQuery: model.countDocuments(mongoQuery),
                modelQuery: model.find(mongoQuery, { __v: 0 }).skip(skip).limit(limit)
            };
        }
        let models = [];
        let count = 0;
        if (populate && populateOptions) {
            count = yield myModel().countQuery.populate(populate).sort(sortObject);
            models = yield myModel().modelQuery.populate(populate).sort(sortObject);
            if (models.length == 0) {
                count = yield myModel().countQuery.populate(populateOptions).sort(sortObject);
                models = yield myModel().modelQuery.populate(populateOptions).sort(sortObject);
            }
        }
        else {
            count = yield myModel().countQuery.sort(sortObject);
            models = yield myModel().modelQuery.sort(sortObject);
        }
        return { count, models };
    });
}
exports.queryModel = queryModel;
