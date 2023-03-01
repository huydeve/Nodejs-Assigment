import express, { NextFunction, Request, Response } from "express";

var router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
    
  res.render("index", { title: "Hello" });
});

export default router;
