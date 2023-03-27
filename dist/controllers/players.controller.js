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
const players_service_1 = __importDefault(require("../services/players.service"));
const firebase_config_1 = require("../configs/firebase.config");
const nations_service_1 = __importDefault(require("../services/nations.service"));
var positions = [
    "Goalkeeper",
    "Right Back",
    "Center Back",
    "Left Back",
    "Defensive Midfielder",
    "Central Midfielder",
    "Attacking Midfielder",
    "Right Winger",
    "Left Winger",
    "Striker",
];
var clubs = [
    "Manchester United",
    "Barcelona",
    "Real Madrid",
    "Bayern Munich",
    "Paris Saint-Germain",
    "Chelsea",
    "Liverpool",
    "Juventus",
    "Manchester City",
    "Arsenal",
];
class PlayersController {
    httpPlayerPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const playersDao = new players_service_1.default();
            try {
                const query = req.query;
                const q = req.query.q;
                const data = yield playersDao.getAllPlayers(Object.assign({}, query));
                const nationData = yield new nations_service_1.default().getAllNations({ limit: 300 });
                console.log(data.limit);
                return res.render("player", Object.assign({ title: "Player", q,
                    positions,
                    clubs, maxValue: 1000, nations: nationData.nations }, data));
            }
            catch (error) {
                return res.send("error");
            }
        });
    }
    httpPlayerDetailPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const playersDao = new players_service_1.default();
            try {
                const { id } = req.params;
                const player = yield playersDao.getPlayer(id);
                return res.render("player-detail", {
                    title: "Player detail page",
                    player,
                });
            }
            catch (error) {
                return res.send("error");
            }
        });
    }
    httpGetAllPlayers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const playersDao = new players_service_1.default();
            try {
                const query = req.query;
                const isCaptain = req.query.isCaptain;
                if (typeof query.isCaptain !== "undefined") {
                    query.isCaptain = isCaptain === "on";
                }
                const data = yield playersDao.getAllPlayers(query);
                const nationData = yield new nations_service_1.default().getAllNations({ limit: 300 });
                const URL = req.originalUrl.split("/filter?")[0];
                return res.render("component/player-row.ejs", Object.assign(Object.assign({ q: query.q, positions,
                    clubs, maxValue: 1000, nations: nationData.nations, errorMessage: req.flash('error') }, data), { URL }));
            }
            catch (error) {
                if (error instanceof Error)
                    res.send(error.message);
            }
        });
    }
    httpGetPlayer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const playersDao = new players_service_1.default();
                const player = yield playersDao.getPlayer(id);
                res.send(player);
            }
            catch (error) {
                if (error instanceof Error)
                    res.send(error.message);
            }
        });
    }
    httpCreatePlayer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isCaptain = req.body.isCaptain === "on";
                const playersDao = new players_service_1.default();
                let imageUrl = '';
                const { name, club, goals, position, nation, career } = req.body;
                console.log(req.body);
                if (req.file)
                    imageUrl = yield (0, firebase_config_1.uploadImage)(req.file);
                yield playersDao.insertPlayer({
                    career,
                    nation,
                    name,
                    club,
                    goals,
                    image: imageUrl,
                    isCaptain,
                    position,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes('dup key')) {
                        req.flash('error', "Name is already in use");
                    }
                }
            }
            finally {
                return res.redirect("/admin/players");
            }
        });
    }
    httpRemovePlayer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const playersDao = new players_service_1.default();
                yield playersDao.deletePlayer(id);
                res.redirect("/admin/players");
            }
            catch (error) {
            }
        });
    }
    httpUpdatePlayer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const player = req.body;
                const isCaptain = req.body.isCaptain === "on";
                let imageUrl = '';
                const playersDao = new players_service_1.default();
                if (req.file)
                    imageUrl = yield (0, firebase_config_1.uploadImage)(req.file);
                yield playersDao.updatePlayer(player.id, Object.assign(Object.assign({}, player), { isCaptain, image: imageUrl.length > 0 ? imageUrl : req.body.image }));
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes('dup key')) {
                        req.flash('error', "Name is already in use");
                    }
                    req.flash('error', error.message);
                }
            }
            finally {
                return res.redirect("/admin/players");
            }
        });
    }
}
exports.default = PlayersController;
