"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const players_controller_1 = __importDefault(require("./players.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const playersRouter = express_1.default.Router();
const playersController = new players_controller_1.default();
playersRouter.use((req, res, next) => {
    res.statusCode = 200;
    next();
});
playersRouter.use(auth_middleware_1.checkNotAdmin);
playersRouter.get("/page", playersController.httpPlayerPage);
playersRouter.get("/page/:id", playersController.httpPlayerDetailPage);
playersRouter.get("/filter", playersController.httpGetAllPlayers);
playersRouter.get("/:id", playersController.httpGetPlayer);
playersRouter.put("/:id", playersController.httpUpdatePlayer);
playersRouter.delete("/:id", playersController.httpRemovePlayer);
playersRouter.post("/", playersController.httpCreatePlayer);
playersRouter.post("/:id", (req, res, next) => {
    res.statusCode = 403;
    return res.send("POST operation not supported on /nations/" + req.params.id);
});
exports.default = playersRouter;
