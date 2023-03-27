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
const users_service_1 = __importDefault(require("../services/users.service"));
class UsersController {
    httpGetOwnInfoUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    httpGetAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDao = new users_service_1.default();
            try {
                const query = req.query;
                const user = req.session.passport.user.profile.email;
                const data = yield userDao.getAllUsers(query, user);
                const URL = req.originalUrl.split("?")[0];
                return res.render("component/user-row.ejs", Object.assign(Object.assign({ q: query.q, errorMessage: req.flash('error') }, data), { URL }));
            }
            catch (error) {
                if (error instanceof Error)
                    res.send(error.message);
            }
        });
    }
    httpGetUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    httpUpdateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    httpCreateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = UsersController;
