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
const firebase_config_1 = require("../configs/firebase.config");
class NationsController {
    httpNationPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const nationsDao = new nations_service_1.default();
            try {
                const query = req.query;
                const q = req.query.q;
                // const { skip, limit } = getPagination(query);
                const data = yield nationsDao.getAllNations(query);
                return res.render("nation", {
                    title: "Nation",
                    q,
                    nations: data.nations,
                    totalPage: data.totalPage,
                    currentPage: data.currentPage,
                    ellipsisEnd: data.ellipsisEnd,
                    ellipsisStart: data.ellipsisStart,
                    end: data.end,
                    start: data.start,
                    limit: data.limit,
                });
            }
            catch (error) {
                return res.send("error");
            }
        });
    }
    httpGetAllNations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const nationsDao = new nations_service_1.default();
            try {
                const query = req.query;
                const data = yield nationsDao.getAllNations(query);
                const q = req.query.q;
                const URL = req.originalUrl.split("?")[0];
                return res.render("component/nation-row.ejs", Object.assign(Object.assign({ errorMessage: req.flash('error'), q }, data), { URL }));
            }
            catch (error) {
                if (error instanceof Error)
                    res.send(error.message);
            }
        });
    }
    httpGetNation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const nationsDao = new nations_service_1.default();
                const nation = yield nationsDao.getNation(id);
                res.send(nation);
            }
            catch (error) {
                if (error instanceof Error)
                    res.send(error.message);
            }
        });
    }
    httpCreateNation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { description, name } = req.body;
                let imageUrl = '';
                const nationsDao = new nations_service_1.default();
                if (req.file)
                    imageUrl = yield (0, firebase_config_1.uploadImage)(req.file);
                yield nationsDao.insertNation({ name, description, image: imageUrl });
                return res.redirect("/admin/nations");
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.send(error.message);
                }
            }
        });
    }
    httpRemoveNation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const nationsDao = new nations_service_1.default();
                yield nationsDao.deleteNation(id);
                res.redirect("/admin/nations");
            }
            catch (error) {
            }
        });
    }
    httpUpdateNation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nation = req.body;
                const nationsDao = new nations_service_1.default();
                let imageUrl = '';
                if (req.file)
                    imageUrl = yield (0, firebase_config_1.uploadImage)(req.file);
                yield nationsDao.updateNation(nation.id, Object.assign(Object.assign({}, nation), { image: imageUrl.length > 0 ? imageUrl : nation.image }));
            }
            catch (error) {
                if (error instanceof Error) {
                    req.flash('error', error.message);
                }
            }
            finally {
                return res.redirect("/admin/nations");
            }
        });
    }
}
exports.default = NationsController;
