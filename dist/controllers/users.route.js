"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = __importDefault(require("./users.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const usersRouter = express_1.default.Router();
usersRouter.use(auth_middleware_1.checkNotAdmin);
usersRouter.get('/', new users_controller_1.default().httpGetAllUsers);
usersRouter.get('/:id', new users_controller_1.default().httpGetUser);
usersRouter.put('/:id', new users_controller_1.default().httpUpdateUser);
usersRouter.post('/', new users_controller_1.default().httpCreateUser);
exports.default = usersRouter;
