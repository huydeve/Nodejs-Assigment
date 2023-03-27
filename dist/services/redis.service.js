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
Object.defineProperty(exports, "__esModule", { value: true });
exports.delAllResponse = exports.delResponse = exports.getResponse = exports.setResponse = void 0;
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({
    url: 'redis://localhost:6379'
}); // create a Redis client
function setResponse(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        client.set(key, JSON.stringify(value), {
            EX: 300, NX: true,
        });
    });
}
exports.setResponse = setResponse;
// Set the OTP in Redis with a TTL of 5 minutes
function getResponse(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.get(key);
    });
}
exports.getResponse = getResponse;
function delResponse(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.del(key);
    });
}
exports.delResponse = delResponse;
function delAllResponse() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.flushDb();
    });
}
exports.delAllResponse = delAllResponse;
exports.default = client;
// Get the OTP from Redis
