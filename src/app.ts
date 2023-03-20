import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import logger from "morgan";
import passport from "passport";
import path from "path";
import { ENV_CONFIG } from "./configs/env.config";
import authRouter from "./controllers/auth.route";
import indexRouter from "./controllers/index.controller";
import nationRouter from "./controllers/nations.route";
import playersRouter from "./controllers/players.route";
import session from 'express-session';
import { sessionStorage } from './middleware/session.middleware';
import adminRouter from './controllers/admin.route';
import flash from 'connect-flash';
import { convertMethod } from './middleware/method.middleware';

// var nationsRouter = require("./routes/nations.route");
// var playersRouter = require("./routes/players.route");

var app = express();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// These id's and secrets should come from .env file.




app.use(session({
  secret: ENV_CONFIG.GOOGLE_CLIENT_SECRET || "default",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: false, // set to true if using HTTPS
    httpOnly: true,
  },

  store: new session.MemoryStore(),

}));

// Configure Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(sessionStorage);
// Configure body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(convertMethod);


app.use("/", indexRouter);
app.use("/nations", nationRouter);
app.use("/auth", authRouter);
app.use("/players", playersRouter);
app.use("/admin", adminRouter);


// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createHttpError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { message: res.locals.message });
});


export default app;
