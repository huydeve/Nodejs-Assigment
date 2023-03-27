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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nations_mongo_1 = __importDefault(require("../models/nations.mongo"));
const query_1 = require("../utils/query");
class NationsService {
    getAllNations(query, getFull) {
        return __awaiter(this, void 0, void 0, function* () {
            const { skip, limit, page } = (0, query_1.getPagination)({
                limit: query.limit,
                page: query.page,
            });
            const mongoQuery = {
                $or: [
                    { name: { $regex: query.q || '', $options: 'i' } },
                ],
            };
            const data = yield (0, query_1.queryModel)(nations_mongo_1.default, mongoQuery, skip, limit);
            return Object.assign({ nations: data.models }, (0, query_1.getPaginationDetails)(data.count, limit, page));
        });
    }
    getNation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield nations_mongo_1.default.findById(id, { __v: 0 });
        });
    }
    insertNation(nation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield nations_mongo_1.default.create(nation);
        });
    }
    updateNation(id, nation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield nations_mongo_1.default.findByIdAndUpdate(id, nation, { new: true });
        });
    }
    deleteNation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield nations_mongo_1.default.findByIdAndRemove(id);
        });
    }
}
exports.default = NationsService;
