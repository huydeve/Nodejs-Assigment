import { check } from "express-validator";

let validateRegisterUser = () => {
    return [ 
      check('username', 'username does not Empty').not().isEmpty(),
      check('username', 'username must be Alphanumeric').isAlphanumeric(),
      check('username', 'username more than 6 degits').isLength({ min: 6 }),
      check('password', 'password more than 6 degits').isLength({ min: 6 })
    ]; 
  }
  
  let validateLogin = () => {
    return [ 
      check('username', 'Invalid does not Empty').not().isEmpty(),
      check('password', 'password more than 6 degits').isLength({ min: 6 })
    ]; 
  }
  
  let validate = {
    validateRegisterUser: validateRegisterUser,
    validateLogin: validateLogin
  };
  
export default validate