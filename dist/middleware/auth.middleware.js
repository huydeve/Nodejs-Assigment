"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNotAdmin = exports.checkIsAdmin = exports.checkLoggedIn = void 0;
const jwt_config_1 = require("../configs/jwt.config");
function checkLoggedIn(req, res, next) {
    try {
        req.body.userId = (0, jwt_config_1.verifyToken)(req);
        next();
    }
    catch (error) {
        req.session.destroy(() => {
            return res.redirect("/auth/login/page");
        });
    }
}
exports.checkLoggedIn = checkLoggedIn;
function checkIsAdmin(req, res, next) {
    const { isAdmin } = req.session.passport.user.profile;
    if (!isAdmin)
        return res.redirect("/");
    req.body.isAdmin = isAdmin;
    next();
}
exports.checkIsAdmin = checkIsAdmin;
function checkNotAdmin(req, res, next) {
    const passport = req.session.passport;
    if (req.session && passport) {
        const { isAdmin } = req.session.passport.user.profile;
        if (isAdmin)
            return res.redirect("/admin/dashboard");
    }
    next();
}
exports.checkNotAdmin = checkNotAdmin;
