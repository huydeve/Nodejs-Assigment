import express from "express";
import PlayersController from "./players.controller";
import { checkNotAdmin } from "../middleware/auth.middleware";
const playersRouter = express.Router();
const playersController = new PlayersController();
playersRouter.use((req, res, next) => {
  res.statusCode = 200;
  next();
});
playersRouter.use(checkNotAdmin);


playersRouter.get("/page", playersController.httpPlayerPage);
playersRouter.get("/page/:id", playersController.httpPlayerDetailPage);


playersRouter.get("/filter", playersController.httpGetAllPlayers);

playersRouter.get("/:id", playersController.httpGetPlayer);

playersRouter.put("/:id", playersController.httpUpdatePlayer);

playersRouter.delete("/:id", playersController.httpRemovePlayer);


playersRouter.post("/", playersController.httpCreatePlayer);

playersRouter.post("/:id", (req, res, next) => {
  res.statusCode = 403;
  return res.send("POST operation not supported on /nations/" + req.params.id);
});
export default playersRouter;
