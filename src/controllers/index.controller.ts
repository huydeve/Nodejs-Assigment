import express, { NextFunction, Request, Response } from "express";
import { checkNotAdmin } from "../middleware/auth.middleware";

var router = express.Router();

/* GET home page. */
router.get("/", checkNotAdmin, function (req: Request, res: Response, next: NextFunction) {

  res.render("index", { title: "Hello" });
});

export default router;
