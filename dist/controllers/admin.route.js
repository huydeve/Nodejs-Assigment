"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_config_1 = require("../configs/firebase.config");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_controller_1 = __importDefault(require("./admin.controller"));
const nations_controller_1 = __importDefault(require("./nations.controller"));
const players_controller_1 = __importDefault(require("./players.controller"));
const method_middleware_1 = require("../middleware/method.middleware");
const users_controller_1 = __importDefault(require("./users.controller"));
const adminRouter = express_1.default.Router();
const adminController = new admin_controller_1.default();
const nationController = new nations_controller_1.default();
const playerController = new players_controller_1.default();
const userController = new users_controller_1.default();
adminRouter.use(auth_middleware_1.checkLoggedIn);
adminRouter.use(auth_middleware_1.checkIsAdmin);
adminRouter.get("/dashboard/", adminController.httpDashBoard);
adminRouter.get("/players/", adminController.httpPlayers);
adminRouter.get("/users/", adminController.httpUsers);
adminRouter.get("/nations/", adminController.httpNations);
adminRouter.get("/nations/filter", nationController.httpGetAllNations);
adminRouter.get("/players/filter", playerController.httpGetAllPlayers);
adminRouter.get("/users/filter", userController.httpGetAllUsers);
adminRouter.delete("/nations/:id", nationController.httpRemoveNation);
adminRouter.delete("/players/:id", playerController.httpRemovePlayer);
adminRouter.use(firebase_config_1.upload.single('image'), method_middleware_1.convertMethod);
adminRouter.put("/players", playerController.httpUpdatePlayer);
adminRouter.post("/players", (req, res, next) => {
    if (!req.body.nation) {
        return res.send("Pls, add least 1 nation in system");
    }
    next();
}, playerController.httpCreatePlayer);
adminRouter.put("/nations", nationController.httpUpdateNation);
adminRouter.post("/nations", nationController.httpCreateNation);
adminRouter.post("/:id", (req, res, next) => {
    res.statusCode = 403;
    return res.send("POST operation not supported on /nations/" + req.params.id);
});
exports.default = adminRouter;
