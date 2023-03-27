"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMethod = void 0;
function convertMethod(req, res, next) {
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
exports.convertMethod = convertMethod;
