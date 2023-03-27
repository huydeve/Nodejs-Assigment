"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
var router = express_1.default.Router();
/* GET home page. */
router.get("/", auth_middleware_1.checkNotAdmin, function (req, res, next) {
    res.render("index", { title: "Hello" });
});
exports.default = router;
