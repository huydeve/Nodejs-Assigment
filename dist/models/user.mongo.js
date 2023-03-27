"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const usersSchema = new Schema({
    password: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    yob: {
        type: Date,
        require: true,
    },
    email: {
        type: String,
        require: false,
        unique: true,
        default: ''
    },
    phone: {
        type: String,
        require: false,
        unique: true,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        require: true,
        default: false,
    }
}, {
    timestamps: true,
});
const Users = mongoose_1.default.model("Users", usersSchema);
exports.default = Users;
