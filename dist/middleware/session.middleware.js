"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionStorage = void 0;
function sessionStorage(req, res, next) {
    res.locals.session = req.session.passport;
    next();
}
exports.sessionStorage = sessionStorage;
