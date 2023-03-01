import express from "express";
import UsersController from "./users.controller";

const usersRouter = express.Router();



usersRouter.get('/', new UsersController().httpGetAllUsers)

usersRouter.get('/:id', new UsersController().httpGetUser)

usersRouter.put('/:id', new UsersController().httpUpdateUser)

usersRouter.post('/', new UsersController().httpCreateUser)





export default usersRouter;
