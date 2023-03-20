import { Request, Response } from "express";
import { verifyToken } from "../configs/jwt.config";

export function checkLoggedIn(req: Request, res: Response, next: Function) {
    try {
        req.body.userId = verifyToken(req)
        next()
    } catch (error) {
        req.session.destroy(() => {
            return res.redirect("/auth/login/page")
        })

    }
}

export function checkIsAdmin(req: Request, res: Response, next: Function) {
    const { isAdmin } = req.session.passport.user.profile
    if (!isAdmin) return res.redirect("/");
    req.body.isAdmin = isAdmin;
    next()
}

export function checkNotAdmin(req: Request, res: Response, next: Function) {
    const passport = req.session.passport
    if (req.session && passport) {
        const { isAdmin } = req.session.passport.user.profile
        if (isAdmin) return res.redirect("/admin/dashboard");
    }
    next()

}