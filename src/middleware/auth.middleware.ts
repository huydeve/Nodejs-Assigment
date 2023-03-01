import { Request, Response } from "express";
import { verifyToken } from "../configs/jwt.config";

export function checkLoggedIn(req: Request, res: Response, next: Function) {
    try {
        req.body.userId = verifyToken(req)
        next()
    } catch (error) {
        return res.redirect("/auth/login/page")
    }
}
