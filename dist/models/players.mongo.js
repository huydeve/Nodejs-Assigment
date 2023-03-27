"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const playersSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    image: {
        type: String,
        require: true,
    },
    club: {
        type: String,
        require: true,
    },
    career: {
        type: String,
        require: true,
    },
    nation: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Nations',
        required: true,
    },
    position: {
        type: String,
        require: true,
    },
    goals: {
        type: Number,
        require: true,
    },
    isCaptain: {
        type: Boolean,
        require: true,
    },
}, {
    timestamps: true,
});
const Players = mongoose_1.default.model("Players", playersSchema);
exports.default = Players;
