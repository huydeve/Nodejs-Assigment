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
const nations_service_1 = __importDefault(require("../services/nations.service"));
const players_service_1 = __importDefault(require("../services/players.service"));
const users_service_1 = __importDefault(require("../services/users.service"));
const dataFake_1 = require("../utils/dataFake");
class AdminController {
    httpDashBoard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.render("admin-dashboard", {
                    title: "Dashboard",
                });
            }
            catch (error) {
                return res.send("error");
            }
        });
    }
    httpPlayers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const q = req.query.q;
                const dataPlayers = yield new players_service_1.default().getAllPlayers(query);
                const dataNations = yield new nations_service_1.default().getAllNations({ limit: 300 });
                return res.render("admin-player", Object.assign(Object.assign({ title: "Player" }, dataPlayers), { q,
                    positions: dataFake_1.positions,
                    clubs: dataFake_1.clubs, nations: dataNations.nations, errorMessage: req.flash('error') }));
            }
            catch (error) {
                if (error instanceof Error)
                    res.send(error.message);
            }
        });
    }
    httpNations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const q = req.query.q;
                const data = yield new nations_service_1.default().getAllNations(query);
                return res.render("admin-nation", Object.assign(Object.assign({ title: "Nation" }, data), { q, errorMessage: req.flash('error') }));
            }
            catch (error) {
                if (error instanceof Error)
                    res.send(error.message);
            }
        });
    }
    httpUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const q = req.query.q;
                const user = req.session.passport.user.profile.email;
                // const { skip, limit } = getPagination(query);
                const data = yield new users_service_1.default().getAllUsers(query, user);
                return res.render("admin-user", {
                    title: "User",
                    users: data.users,
                    totalPage: data.totalPage,
                    currentPage: data.currentPage,
                    ellipsisEnd: data.ellipsisEnd,
                    ellipsisStart: data.ellipsisStart,
                    maxValue: 120,
                    maxDefault: 50,
                    end: data.end,
                    start: data.start,
                    q,
                    limit: data.limit,
                    errorMessage: req.flash('error')
                });
            }
            catch (error) {
                if (error instanceof Error)
                    res.send(error.message);
            }
        });
    }
}
exports.default = AdminController;
