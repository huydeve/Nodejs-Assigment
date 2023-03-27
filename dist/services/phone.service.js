"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOtpPhone = exports.sendToPhone = void 0;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = "ACd5fb6f00dc32f68feaf0124bad32ae86";
const authToken = "bba8c8d0b0eba4f1ceec5ad3a668d950";
const verifySid = "VAa865b66be370a85509aa33b0e7772c64";
const client = (0, twilio_1.default)(accountSid, authToken);
function sendToPhone(phone) {
    console.log(phone);
    return client.verify.v2.services(verifySid)
        .verifications.create({ to: phone, channel: "sms" });
}
exports.sendToPhone = sendToPhone;
function checkOtpPhone(otp, phone) {
    return client.verify.v2.services(verifySid)
        .verificationChecks.create({ to: phone, code: otp });
}
exports.checkOtpPhone = checkOtpPhone;
