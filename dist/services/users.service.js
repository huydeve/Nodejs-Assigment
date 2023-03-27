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
const bcrypt_config_1 = require("../configs/bcrypt.config");
const user_mongo_1 = __importDefault(require("../models/user.mongo"));
const query_1 = require("../utils/query");
class UsersService {
    getAllUsers(query, userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            // const query = name
            //   ? { name: { $regex: new RegExp(`.*${name}.*`, "i") } }
            //   : {};
            const { skip, limit, page } = (0, query_1.getPagination)({
                limit: query.limit,
                page: query.page,
            });
            const sortObject = {};
            const mongoQuery = {
                email: { $not: { $regex: userEmail, $options: 'i' } },
                $or: [
                    { name: { $regex: query.q || '', $options: 'i' } },
                    { email: { $regex: query.q || '', $options: 'i' } },
                ],
            };
            console.log(query.isAdmin);
            if (query.sortType && query.sortBy) {
                sortObject[`${query.sortBy}`] = Number(query.sortType);
            }
            if (typeof query.isAdmin !== 'undefined') {
                mongoQuery.isAdmin = query.isAdmin;
            }
            if (typeof query.ageRange !== 'undefined' && query.ageRange.length > 0) {
                console.log(new Date(new Date().getFullYear() - (Number(query.ageRange[0]), 0, 1)));
                const startAge = (Number(query.ageRange[0])); // Start age of range
                const endAge = (Number(query.ageRange[1])); // End age of range
                console.log(startAge, endAge);
                const startDOB = new Date(new Date().setFullYear(new Date().getFullYear() - endAge)); // Calculate start date of range
                const endDOB = new Date(new Date().setFullYear(new Date().getFullYear() - startAge)); // Calculate end date of range
                mongoQuery.yob = {
                    $lte: endDOB,
                    $gte: startDOB
                };
            }
            const { count, models } = yield (0, query_1.queryModel)(user_mongo_1.default, mongoQuery, skip, limit, sortObject);
            return Object.assign({ users: models }, (0, query_1.getPaginationDetails)(count, limit, page));
        });
    }
    getUser(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_mongo_1.default.findOne({ $or: [{ email: value }, { phone: value }] });
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_mongo_1.default.findById(id);
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.password = yield (0, bcrypt_config_1.hashPassword)(user.password);
            return yield user_mongo_1.default.create(user);
        });
    }
    updateUserById(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_mongo_1.default.findByIdAndUpdate(id, {
                email: user.email,
                name: user.name,
                yob: user.yob,
                phone: user.phone
            });
        });
    }
    updateUserPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_mongo_1.default.findByIdAndUpdate(id, {
                password: yield (0, bcrypt_config_1.hashPassword)(password)
            });
        });
    }
    updateUserPasswordByOr(verifyBy, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(verifyBy);
            return yield user_mongo_1.default.findOneAndUpdate({ $or: [{ email: verifyBy }, { phone: verifyBy }] }, {
                password: yield (0, bcrypt_config_1.hashPassword)(password)
            }, { new: true });
        });
    }
}
exports.default = UsersService;
