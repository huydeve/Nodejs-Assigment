"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeVerify = void 0;
function removeVerify(req, res, next) {
    req.session.isVerify = false;
    next();
}
exports.removeVerify = removeVerify;
