"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otp = void 0;
const randomstring_1 = __importDefault(require("randomstring"));
function otp() {
    return randomstring_1.default.generate({
        length: 6,
        charset: 'numeric'
    });
}
exports.otp = otp;
