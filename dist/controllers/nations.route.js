"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nations_controller_1 = __importDefault(require("./nations.controller"));
const firebase_config_1 = require("../configs/firebase.config");
const auth_middleware_1 = require("../middleware/auth.middleware");
const nationsController = new nations_controller_1.default();
const nationRouter = express_1.default.Router();
nationRouter.use(auth_middleware_1.checkNotAdmin);
nationRouter.get("/page", nationsController.httpNationPage);
nationRouter.get("/filter", nationsController.httpGetAllNations);
nationRouter.get("/:id", nationsController.httpGetNation);
nationRouter.put("/:id", nationsController.httpUpdateNation);
nationRouter.delete("/:id", nationsController.httpRemoveNation);
nationRouter.post("/", firebase_config_1.upload.single('image'), nationsController.httpCreateNation);
nationRouter.post("/:id", (req, res, next) => {
    res.statusCode = 403;
    return res.send("POST operation not supported on /nations/" + req.params.id);
});
exports.default = nationRouter;
