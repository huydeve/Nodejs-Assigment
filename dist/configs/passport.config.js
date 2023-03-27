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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_local_1 = __importDefault(require("passport-local"));
const user_mongo_1 = __importDefault(require("../models/user.mongo"));
const env_config_1 = require("./env.config");
const jwt_config_1 = require("./jwt.config");
const bcrypt_config_1 = require("./bcrypt.config");
const LocalStrategy = passport_local_1.default.Strategy;
const JWTStrategy = passport_jwt_1.default.Strategy;
const ExtractJWT = passport_jwt_1.default.ExtractJwt;
const passportConfig = passport_1.default;
passportConfig.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_mongo_1.default.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'Invalid username or password' });
        }
        const isMatch = yield (0, bcrypt_config_1.verifyPassword)(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid username or password' });
        }
        const jwtToken = (0, jwt_config_1.generateToken)(user);
        return done(null, { jwtToken, profile: user });
    }
    catch (err) {
        return done(err);
    }
})));
passportConfig.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env_config_1.ENV_CONFIG.GOOGLE_CLIENT_SECRET || 'default_secret',
}, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_mongo_1.default.findById(jwtPayload.sub);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})));
passportConfig.use(new passport_google_oauth20_1.Strategy({
    clientID: env_config_1.ENV_CONFIG.GOOGLE_CLIENT_ID || '',
    clientSecret: env_config_1.ENV_CONFIG.GOOGLE_CLIENT_SECRET || '',
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = profile.emails && profile.emails[0].value;
        if (!email) {
            return done(null, false, { message: 'Email not found in Google profile' });
        }
        let user = yield user_mongo_1.default.findOne({ email });
        if (!user) {
            user = yield user_mongo_1.default.create({
                name: profile.displayName,
                yob: '',
                email,
                password: '',
                isAdmin: false,
            });
        }
        const jwtToken = (0, jwt_config_1.generateToken)(user);
        return done(null, { jwtToken, profile: user });
    }
    catch (err) {
        return done(err);
    }
})));
// Save the session to the cookie
passportConfig.serializeUser((user, done) => {
    done(null, user);
});
// Read the session from the cookie
passportConfig.deserializeUser(function (user, done) {
    // User.findById(id).then(user => {
    //   done(null, user);
    // });
    return done(null, user);
});
exports.default = passportConfig;
