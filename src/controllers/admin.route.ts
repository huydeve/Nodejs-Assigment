import express from "express";
import { upload } from "../configs/firebase.config";
import { checkIsAdmin, checkLoggedIn } from "../middleware/auth.middleware";
import AdminController from "./admin.controller";
import NationsController from "./nations.controller";
import PlayersController from "./players.controller";
import { convertMethod } from "../middleware/method.middleware";
import UsersController from "./users.controller";
const adminRouter = express.Router();
const adminController = new AdminController();
const nationController = new NationsController();
const playerController = new PlayersController();
const userController = new UsersController();

adminRouter.use(checkLoggedIn);
adminRouter.use(checkIsAdmin);


adminRouter.get("/dashboard/", adminController.httpDashBoard);
adminRouter.get("/players/", adminController.httpPlayers);
adminRouter.get("/users/", adminController.httpUsers);
adminRouter.get("/nations/", adminController.httpNations);



adminRouter.get("/nations/filter", nationController.httpGetAllNations);
adminRouter.get("/players/filter", playerController.httpGetAllPlayers);
adminRouter.get("/users/filter", userController.httpGetAllUsers);


adminRouter.delete("/nations/:id", nationController.httpRemoveNation);
adminRouter.delete("/players/:id", playerController.httpRemovePlayer);
adminRouter.use(upload.single('image'), convertMethod);
adminRouter.put("/players", playerController.httpUpdatePlayer);

adminRouter.post("/players", (req, res, next) => {

    if (!req.body.nation) {
        return res.send("Pls, add least 1 nation in system")
    }
    next()
}, playerController.httpCreatePlayer);

adminRouter.put("/nations", nationController.httpUpdateNation);
adminRouter.post("/nations", nationController.httpCreateNation);


adminRouter.post("/:id", (req, res, next) => {
    res.statusCode = 403;
    return res.send("POST operation not supported on /nations/" + req.params.id);
});
export default adminRouter;
