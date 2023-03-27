"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const env_config_1 = require("./configs/env.config");
const auth_route_1 = __importDefault(require("./controllers/auth.route"));
const index_controller_1 = __importDefault(require("./controllers/index.controller"));
const nations_route_1 = __importDefault(require("./controllers/nations.route"));
const players_route_1 = __importDefault(require("./controllers/players.route"));
const express_session_1 = __importDefault(require("express-session"));
const session_middleware_1 = require("./middleware/session.middleware");
const admin_route_1 = __importDefault(require("./controllers/admin.route"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const method_middleware_1 = require("./middleware/method.middleware");
// var nationsRouter = require("./routes/nations.route");
// var playersRouter = require("./routes/players.route");
var app = (0, express_1.default)();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
// These id's and secrets should come from .env file.
app.use((0, express_session_1.default)({
    secret: env_config_1.ENV_CONFIG.GOOGLE_CLIENT_SECRET || "default",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
    },
    store: new express_session_1.default.MemoryStore(),
}));
// Configure Passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(session_middleware_1.sessionStorage);
// Configure body parser middleware
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// view engine setup
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use((0, connect_flash_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.use(method_middleware_1.convertMethod);
app.use("/", index_controller_1.default);
app.use("/nations", nations_route_1.default);
app.use("/auth", auth_route_1.default);
app.use("/players", players_route_1.default);
app.use("/admin", admin_route_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error", { message: res.locals.message });
});
exports.default = app;
