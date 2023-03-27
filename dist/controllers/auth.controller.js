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
const bcrypt_config_1 = require("../configs/bcrypt.config");
const users_service_1 = __importDefault(require("../services/users.service"));
const redis_service_1 = require("../services/redis.service");
const otpGenerator_1 = require("../utils/otpGenerator");
const email_service_1 = require("../services/email.service");
const phone_service_1 = require("../services/phone.service");
const jwt_config_1 = require("../configs/jwt.config");
class AuthController {
    httpLoginPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errorMessage = req.flash('error');
                res.render("login", {
                    title: "Login",
                    errorMessage
                });
            }
            catch (error) {
                return res.send("error");
            }
        });
    }
    httpLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.session.destroy(() => { res.redirect('/auth/login/page'); });
        });
    }
    httpRegistrationPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errorMessage = req.flash('error');
                res.render("registration", { title: 'Registration page', errorMessage });
            }
            catch (error) {
                return res.send("error");
            }
        });
    }
    httpRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const errors = validationResult(req);
            const userDAO = new users_service_1.default();
            const param = req.body;
            try {
                const user = yield userDAO.getUser(param.email);
                if (!user) {
                    yield new users_service_1.default().createUser(param);
                    return res.redirect('/auth/login/page');
                }
                else {
                    req.flash('error', 'That email already exisits!');
                    return res.redirect('/auth/registration/page');
                }
            }
            catch (error) {
                if (error instanceof Error)
                    req.flash('error', error.message);
                return res.redirect('/auth/registration/page');
            }
        });
    }
    httpChangePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldPassword, newPassword, confirmPassword } = req.body;
                const userService = new users_service_1.default();
                const user = yield userService.getUser(req.session.passport.user.profile.email);
                if (!user)
                    throw new Error(`User ${user}`);
                const havePassword = user.password.length > 0;
                if (havePassword) {
                    const isMatch = yield (0, bcrypt_config_1.verifyPassword)(oldPassword, user.password);
                    if (!isMatch) {
                        throw new Error(`Password is not correct!`);
                    }
                }
                if (oldPassword === newPassword) {
                    throw new Error(`Pls Enter New Password different with Old Password!`);
                }
                if (newPassword !== confirmPassword) {
                    throw new Error(`New Password and Confirm Password not match!`);
                }
                yield userService.updateUserPassword(req.session.passport.user.profile._id, newPassword);
                req.session.destroy(() => { return res.redirect('/auth/page/login'); });
            }
            catch (err) {
                if (err instanceof Error) {
                    req.flash('error', err.message);
                    return res.redirect('/auth/profile/page');
                }
            }
        });
    }
    httpForgotPasswordPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errorMessage = req.flash('error');
                res.render("forgot-password", { title: 'Forgot password', errorMessage });
            }
            catch (error) {
                if (error instanceof Error)
                    return res.send(error.message);
            }
        });
    }
    httpOTPPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errorMessage = req.flash('error');
                res.render("enter-otp", { title: 'OTP', errorMessage });
            }
            catch (error) {
                if (error instanceof Error)
                    return res.send(error.message);
            }
        });
    }
    httpResetPasswordPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errorMessage = req.flash('error');
                res.render("enter-new-password", { title: 'Reset Password', errorMessage });
            }
            catch (error) {
                if (error instanceof Error)
                    return res.send(error.message);
            }
        });
    }
    httpSendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.body.email;
            let phone = req.body.phone;
            const notRender = req.body.notRender;
            const array = [];
            const userService = new users_service_1.default();
            let token = null;
            const tokenCookie = req.cookies.token;
            try {
                if (tokenCookie && !email && !phone) {
                    const decode = (0, jwt_config_1.verifySecretToken)(tokenCookie);
                    if (decode === null || decode === void 0 ? void 0 : decode.strategy.includes("@")) {
                        email = decode.strategy;
                    }
                    else {
                        phone = decode === null || decode === void 0 ? void 0 : decode.strategy;
                    }
                }
                //email or phone was registration 
                const user = yield userService.getUser(email || phone);
                if (user) {
                    if (email && !phone) {
                        const otpService = (0, otpGenerator_1.otp)();
                        yield (0, email_service_1.sendToEmail)(email, otpService);
                        token = (0, jwt_config_1.secretToken)(email, '');
                        array.push(otpService);
                        yield (0, redis_service_1.delResponse)(email);
                    }
                    if (phone && !email) {
                        const x = (yield (0, phone_service_1.sendToPhone)(phone)).serviceSid;
                        token = (0, jwt_config_1.secretToken)(phone, '');
                        array.push(x);
                        yield (0, redis_service_1.delResponse)(phone);
                    }
                    if (token) {
                        array.push(token);
                        yield (0, redis_service_1.setResponse)(email || phone, array);
                    }
                }
                if (!notRender)
                    return res.cookie("token", token, {
                        httpOnly: true,
                    }).redirect('/auth/forgot-password/otp/page');
                return res.status(200)
                    .cookie("token", token, {
                    httpOnly: true,
                }).send({ token });
            }
            catch (error) {
                if (error instanceof Error) {
                    req.flash('error', error.message);
                    return res.redirect('/auth/forgot-password/page');
                }
            }
        });
    }
    httpVerifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp } = req.body;
            const token = req.cookies.token;
            let secretKey = null;
            try {
                const decoded = (0, jwt_config_1.verifySecretToken)(token);
                if (!decoded)
                    throw new Error('Decode failed');
                const rawToken = yield (0, redis_service_1.getResponse)(decoded.strategy);
                if (!rawToken)
                    throw new Error('Cant not parse Token');
                const redisToken = JSON.parse(rawToken);
                if (token !== redisToken[1])
                    throw new Error('Invalid Token');
                if (decoded.strategy.includes('@')) {
                    if (!(redisToken[0] === otp))
                        throw new Error('Invalid OTP');
                    else
                        secretKey = (0, jwt_config_1.secretToken)(decoded.strategy, otp);
                }
                else if (decoded.strategy.includes('+')) {
                    console.log(decoded.strategy);
                    const checkOtp = yield (0, phone_service_1.checkOtpPhone)(otp, decoded.strategy);
                    if (!(checkOtp.status === 'approved'))
                        throw new Error('Invalid OTP');
                    else
                        secretKey = (0, jwt_config_1.secretToken)(decoded.strategy, checkOtp.accountSid);
                }
                else {
                    throw new Error('Invalid Strategy');
                }
                //store the secret to redis
                const queryToken = [...redisToken];
                queryToken[1] = secretKey;
                yield (0, redis_service_1.delResponse)(decoded.strategy);
                yield (0, redis_service_1.setResponse)(decoded.strategy, queryToken);
                return res.cookie("token", secretKey, {
                    httpOnly: true,
                }).redirect('/auth/forgot-password/reset-password/page');
            }
            catch (error) {
                if (error instanceof Error) {
                    req.flash('error', error.message);
                    return res.redirect('/auth/forgot-password/otp/page');
                }
            }
        });
    }
    httpNewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newPassword } = req.body;
            const token = req.cookies.token;
            const userService = new users_service_1.default();
            try {
                const decoded = (0, jwt_config_1.verifySecretToken)(token);
                if (!decoded)
                    throw new Error('Decode failed');
                const rawToken = yield (0, redis_service_1.getResponse)(decoded.strategy);
                if (!rawToken)
                    throw new Error('Cant not parse Token');
                const redisToken = JSON.parse(rawToken);
                console.log(redisToken[1] == token);
                if (token !== redisToken[1])
                    throw new Error('Invalid Token');
                if (decoded.strategy)
                    yield userService.updateUserPasswordByOr(decoded.strategy, newPassword);
                yield (0, redis_service_1.delResponse)(decoded.strategy);
                return res.clearCookie("token").redirect('/auth/login/page');
            }
            catch (error) {
                if (error instanceof Error) {
                    req.flash('error', error.message);
                    return res.redirect('/auth/forgot-password/reset-password/page');
                }
            }
        });
    }
    httpProfilePage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.session.passport;
            const userService = new users_service_1.default();
            const user = yield userService.getUser(req.session.passport.user.profile.email);
            if (!user)
                throw new Error('User not found');
            let havePassword = user.password.length > 0;
            const errorMessage = req.flash('error');
            return res.render('profile', { userId: userId.user.profile._id, title: "Profile Page", havePassword, errorMessage });
        });
    }
    httpUpdateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new users_service_1.default().updateUserById(req.body.userId.id, req.body);
                req.session.passport.user.profile.yob = req.body.yob;
                req.session.passport.user.profile.name = req.body.name;
                req.session.passport.user.profile.email = req.body.email;
                req.session.passport.user.profile.phone = req.body.phone;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes('dup key')) {
                        req.flash('error', "Email is already in use");
                    }
                }
            }
            finally {
                return res.redirect("/auth/profile/page");
            }
        });
    }
}
exports.default = AuthController;
