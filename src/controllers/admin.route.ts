import express from "express";
import { upload } from "../configs/firebase.config";
import { checkLoggedIn } from "../middleware/auth.middleware";
import AdminController from "./admin.controller";
import NationsController from "./nations.controller";
import PlayersController from "./players.controller";
const adminRouter = express.Router();
const adminController = new AdminController();
const nationController = new NationsController();
const playerController = new PlayersController();
adminRouter.use(checkLoggedIn);
adminRouter.use((req, res, next) => {
    const { isAdmin } = req.session.passport.user.profile
    if (!isAdmin) return res.redirect("/");
    next()
});


adminRouter.get("/dashboard", adminController.httpDashBoard);
adminRouter.get("/players", adminController.httpPlayers);
adminRouter.get("/users", adminController.httpUsers);
adminRouter.get("/nations", adminController.httpNations);

adminRouter.delete("/nations/:id", nationController.httpRemoveNation);


adminRouter.delete("/players/:id", playerController.httpRemovePlayer);
adminRouter.use(upload.single('image'), (req, res, next) => {

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
});
adminRouter.put("/players", playerController.httpUpdatePlayer);
adminRouter.post("/players", (req, res, next) => {
    console.log(req.body.nation);

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
