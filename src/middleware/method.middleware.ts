import { NextFunction, Request, Response } from "express";

export function convertMethod (req: Request, res: Response, next: NextFunction)  {

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
}