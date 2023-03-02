import express from "express";
import UsersController from "./users.controller";
import { checkNotAdmin } from "../middleware/auth.middleware";

const usersRouter = express.Router();

usersRouter.use(checkNotAdmin);

usersRouter.get('/', new UsersController().httpGetAllUsers)

usersRouter.get('/:id', new UsersController().httpGetUser)

usersRouter.put('/:id', new UsersController().httpUpdateUser)

usersRouter.post('/', new UsersController().httpCreateUser)





export default usersRouter;
