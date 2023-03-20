import { NextFunction, Request, Response } from "express"
import { checkOtpPhone } from "../services/phone.service"





export function removeVerify(req: Request, res: Response, next: NextFunction) {
    req.session.isVerify = false;
    next()
}