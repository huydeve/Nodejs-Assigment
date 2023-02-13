import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes";
import nationRouter from "./routes/nations.route";
import playersRouter from "./routes/players.route";

// var nationsRouter = require("./routes/nations.route");
// var playersRouter = require("./routes/players.route");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
console.log(__dirname);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
  if (req.body)
    switch (req.body._method) {
      case "delete":
        req.method = "DELETE";
        break;
      case "put":
        req.method = "PUT";
        break;
      default:
        req.method = req.method;
        break;
    }
  req.url = req.path;
  next();
});

app.use("/", indexRouter);
app.use("/nations", nationRouter);
app.use("/players", playersRouter);

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
  res.render("error");
});

export default app;
