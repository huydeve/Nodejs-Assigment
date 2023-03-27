"use strict";
// jwt.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySecretToken = exports.secretToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("./env.config");
const generateToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        yob: user.yob,
        isAdmin: user.isAdmin,
    };
    return jsonwebtoken_1.default.sign(payload, env_config_1.ENV_CONFIG.JWT_SECRET, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
const verifyToken = (req) => {
    const sessionData = req.session.passport;
    if (sessionData && sessionData.user) {
        if (!sessionData.user.jwtToken) {
            throw new Error('JWT token not found in session');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(sessionData.user.jwtToken, env_config_1.ENV_CONFIG.JWT_SECRET);
            return decoded;
        }
        catch (err) {
            if (err instanceof Error)
                throw new Error(`Invalid JWT token: ${err.message}`);
        }
    }
    throw new Error(`User not login`);
};
exports.verifyToken = verifyToken;
const secretToken = (strategy, key) => {
    return jsonwebtoken_1.default.sign({ strategy, key }, env_config_1.ENV_CONFIG.JWT_SECRET, { expiresIn: '3m' });
};
exports.secretToken = secretToken;
const verifySecretToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_config_1.ENV_CONFIG.JWT_SECRET);
        return decoded;
    }
    catch (err) {
        if (err instanceof Error)
            throw new Error(`Invalid JWT token: ${err.message}`);
    }
};
exports.verifySecretToken = verifySecretToken;
