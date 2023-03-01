import { NextFunction, Request, Response } from "express";

export function sessionStorage(req: Request, res: Response, next: NextFunction) {
    res.locals.session = req.session.passport;
    next();
}