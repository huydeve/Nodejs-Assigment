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
exports.sendToEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = require("../configs/env.config");
const googleapis_1 = require("googleapis");
const CLIENT_ID = env_config_1.ENV_CONFIG.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = env_config_1.ENV_CONFIG.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = env_config_1.ENV_CONFIG.GOOGLE_CLIENT_PLAYGROUND;
const REFRESH_TOKEN = env_config_1.ENV_CONFIG.GOOGLE_REFRESH_TOKEN;
const myOAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});
function sendToEmail(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accessToken = yield myOAuth2Client.getAccessToken();
            const transport = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'lozvai123@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: `${accessToken}`,
                },
            });
            const mailOptions = {
                from: 'Ligma <lozvai123@gmail.com>',
                to: email,
                subject: 'Verify OTP',
                html: `<h1>Your OTP: ${otp}</h1>`,
            };
            const result = yield transport.sendMail(mailOptions);
            return result;
        }
        catch (error) {
            return error;
        }
    });
}
exports.sendToEmail = sendToEmail;
