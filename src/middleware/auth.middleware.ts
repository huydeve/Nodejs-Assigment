import { Request, Response } from "express";
import { verifyToken } from "../configs/jwt.config";

export function checkLoggedIn(req: Request, res: Response, next: Function) {
    try {
        req.body.userId = verifyToken(req)
        console.log(req.session.passport.user.jwtToken);
        
        next()
    } catch (error) {
        return res.redirect("/auth/login/page")
    }
}


export function checkNotAdmin(req: Request, res: Response, next: Function) {
    const passport = req.session.passport
    if (req.session && passport) {
        const { isAdmin } = req.session.passport.user.profile
        if (isAdmin) return res.redirect("/admin/dashboard");
    }
    next()

}