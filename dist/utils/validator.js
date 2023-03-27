"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
let validateRegisterUser = () => {
    return [
        (0, express_validator_1.check)('username', 'username does not Empty').not().isEmpty(),
        (0, express_validator_1.check)('username', 'username must be Alphanumeric').isAlphanumeric(),
        (0, express_validator_1.check)('username', 'username more than 6 degits').isLength({ min: 6 }),
        (0, express_validator_1.check)('password', 'password more than 6 degits').isLength({ min: 6 })
    ];
};
let validateLogin = () => {
    return [
        (0, express_validator_1.check)('username', 'Invalid does not Empty').not().isEmpty(),
        (0, express_validator_1.check)('password', 'password more than 6 degits').isLength({ min: 6 })
    ];
};
let validate = {
    validateRegisterUser: validateRegisterUser,
    validateLogin: validateLogin
};
exports.default = validate;
