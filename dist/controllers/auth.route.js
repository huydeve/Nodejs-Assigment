"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const passport_config_1 = __importDefault(require("../configs/passport.config"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const authRouter = express_1.default.Router();
const authController = new auth_controller_1.default();
authRouter.use((req, res, next) => {
    res.statusCode = 200;
    next();
});
authRouter.get('/forgot-password/page', authController.httpForgotPasswordPage);
authRouter.get('/forgot-password/otp/page', authController.httpOTPPage);
authRouter.get('/forgot-password/reset-password/page', authController.httpResetPasswordPage);
authRouter.post('/forgot-password/send-otp', authController.httpSendOTP);
authRouter.post('/forgot-password/verify-otp', authController.httpVerifyOtp);
authRouter.post('/forgot-password/reset-password', authController.httpNewPassword);
authRouter.get("/login/page", authController.httpLoginPage);
authRouter.get("/registration/page", authController.httpRegistrationPage);
authRouter.post("/login", passport_config_1.default.authenticate('local', { failureRedirect: '/auth/login/page', session: true, failureFlash: true }), (req, res) => {
    const isAdmin = req.session.passport.user.profile.isAdmin;
    if (isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    return res.redirect('/');
});
authRouter.post("/registration", authController.httpRegistration);
authRouter.get("/logout", authController.httpLogout);
authRouter.get("/google", passport_config_1.default.authenticate('google', {
    scope: ['profile', 'email'], accessType: 'offline'
}));
authRouter.get("/google/callback", passport_config_1.default.authenticate('google', {
    failureRedirect: '/failure', session: true
}), (req, res) => {
    const isAdmin = req.session.passport.user.profile.isAdmin;
    if (isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    return res.redirect('/');
});
authRouter.use(auth_middleware_1.checkLoggedIn);
authRouter.get('/profile/page', authController.httpProfilePage);
authRouter.put('/profile', authController.httpUpdateProfile);
authRouter.put('/changePassword', authController.httpChangePassword);
authRouter.get('/failure', (req, res) => {
    return res.send('Failed to log in!');
});
exports.default = authRouter;
