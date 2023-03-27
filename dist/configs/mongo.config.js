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
exports.mongoDisconnect = exports.mongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("./env.config");
const MONGO_URL = env_config_1.ENV_CONFIG.MONGO_URL;
mongoose_1.default.connection.once("open", () => {
    console.log("Mongoose connection ready!");
});
mongoose_1.default.connection.on("error", (err) => {
    console.log(err);
});
function mongoConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        if (MONGO_URL)
            return yield mongoose_1.default.connect(MONGO_URL);
        return console.log("Not url");
    });
}
exports.mongoConnect = mongoConnect;
function mongoDisconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield mongoose_1.default.disconnect();
    });
}
exports.mongoDisconnect = mongoDisconnect;
