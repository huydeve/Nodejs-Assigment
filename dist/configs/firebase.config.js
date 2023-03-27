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
exports.uploadImage = exports.upload = exports.bucket = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
//@ts-ignore
const serviceKey_json_1 = __importDefault(require("../../path/to/serviceKey.json"));
const multer_1 = __importDefault(require("multer"));
// Initialize firebase admin SDK
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceKey_json_1.default),
    storageBucket: 'fifa-eea18.appspot.com'
});
// Cloud storage
exports.bucket = firebase_admin_1.default.storage().bucket();
// Multer configuration
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
});
function uploadImage(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const { originalname, buffer } = file;
        const fileUpload = exports.bucket.file(originalname);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });
        return new Promise((resolve, reject) => {
            blobStream.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                yield fileUpload.getSignedUrl({
                    action: 'read',
                    expires: "12-2-2500"
                }).then((response) => {
                    resolve(response.toString());
                });
            })).on('error', (err) => {
                reject(err);
            }).end(buffer);
        });
    });
}
exports.uploadImage = uploadImage;
