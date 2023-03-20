import express from "express";
import NationsController from "./nations.controller";
import { upload } from "../configs/firebase.config";
import { checkNotAdmin } from "../middleware/auth.middleware";

const nationsController = new NationsController();

const nationRouter = express.Router();
nationRouter.use(checkNotAdmin);
nationRouter.get("/page", nationsController.httpNationPage);

nationRouter.get("/filter", nationsController.httpGetAllNations);

nationRouter.get("/:id", nationsController.httpGetNation);

nationRouter.put("/:id", nationsController.httpUpdateNation);

nationRouter.delete("/:id", nationsController.httpRemoveNation);


nationRouter.post("/", upload.single('image'), nationsController.httpCreateNation);

nationRouter.post("/:id", (req, res, next) => {
  res.statusCode = 403;
  return res.send("POST operation not supported on /nations/" + req.params.id);
});

export default nationRouter;
