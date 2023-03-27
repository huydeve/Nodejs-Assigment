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
const players_mongo_1 = __importDefault(require("../models/players.mongo"));
const query_1 = require("../utils/query");
class PlayersService {
    getAllPlayers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortObject = {};
            const { skip, limit, page } = (0, query_1.getPagination)({
                limit: query.limit,
                page: query.page,
            });
            const mongoQuery = {};
            if (query.q) {
                mongoQuery.$or = [
                    { name: { $regex: query.q, $options: 'i' } },
                    { club: { $regex: query.q, $options: 'i' } },
                    { position: { $regex: query.q, $options: 'i' } },
                    { career: { $regex: query.q, $options: 'i' } },
                ];
                if (Number(query.q)) {
                    mongoQuery.$or[mongoQuery.$or.length - 1] = { goals: Number(query.q) };
                }
            }
            if (query.sortType && query.sortBy) {
                sortObject[`${query.sortBy}`] = Number(query.sortType);
            }
            if (typeof query.goalsRange !== 'undefined' && query.goalsRange.length >= 2) {
                mongoQuery.goals = { $gte: Number(query.goalsRange[0]), $lte: query.goalsRange[1] };
            }
            if (typeof query.clubs !== "undefined" && query.clubs.length > 0) {
                mongoQuery.club = { $in: query.clubs };
            }
            if (typeof query.positions !== "undefined" && query.positions.length > 0) {
                mongoQuery.position = { $in: query.positions };
            }
            if (typeof query.nations !== "undefined" && query.nations.length > 0) {
                mongoQuery.nation = { $in: query.nations };
            }
            if (typeof query.isCaptain !== 'undefined')
                mongoQuery.isCaptain = query.isCaptain;
            const data = yield (0, query_1.queryModel)(players_mongo_1.default, mongoQuery, skip, limit, sortObject, 'nation', {
                path: 'nation',
                match: { name: { $regex: query.q || '', $options: 'i' } },
            });
            return Object.assign({ players: data.models, maxDefault: query.goalsRange ? query.goalsRange[1] : 0 }, (0, query_1.getPaginationDetails)(data.count, limit, page));
        });
    }
    getPlayer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield players_mongo_1.default.findById(id, { __v: 0 }).populate('nation');
        });
    }
    insertPlayer(player) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield players_mongo_1.default.create(player);
        });
    }
    updatePlayer(id, Player) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield players_mongo_1.default.findByIdAndUpdate(id, Player, {
                upsert: true,
            });
        });
    }
    deletePlayer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield players_mongo_1.default.findByIdAndRemove(id);
        });
    }
}
exports.default = PlayersService;
