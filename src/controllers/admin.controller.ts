import { NextFunction, Request, Response } from "express";
import NationsDAO from "../services/nations.service";
import { getPagination } from "../utils/query";
import { Query } from "../types/nationQuery";
import { INation } from "../models/nations.mongo";
import NationsService from "../services/nations.service";
import PlayersService from "../services/players.service";
import UsersService from "../services/users.service";
var positions = [
    "Goalkeeper",
    "Right Back",
    "Center Back",
    "Left Back",
    "Defensive Midfielder",
    "Central Midfielder",
    "Attacking Midfielder",
    "Right Winger",
    "Left Winger",
    "Striker",
];
var clubs = [
    "Manchester United",
    "Barcelona",
    "Real Madrid",
    "Bayern Munich",
    "Paris Saint-Germain",
    "Chelsea",
    "Liverpool",
    "Juventus",
    "Manchester City",
    "Arsenal",
];
class AdminController {
    async httpDashBoard(req: Request, res: Response) {

        try {
            return res.render("admin-dashboard", {
                title: "Dashboard",
            });
        } catch (error) {
            return res.send("error");
        }
    }

    async httpPlayers(req: Request, res: Response, next: NextFunction) {
        try {

            const query = req.query as unknown as Query;
            const searchValue = req.query.searchValue as string;

            const { skip, limit } = getPagination(query);

            const players = await new PlayersService().getAllPlayers(skip, limit, searchValue, undefined);
            const nations = await new NationsService().getAllNations(0, 300, "");


            return res.render("admin-player", {
                title: "Player",
                players,
                searchValue,
                positions,
                clubs,
                nations,
            });
        } catch (error) {
            if (error instanceof Error) res.send(error.message);
        }
    }

    async httpNations(req: Request, res: Response, next: NextFunction) {
        try {

            const query = req.query as unknown as Query;
            const searchValue = req.query.searchValue as string;

            const { skip, limit } = getPagination(query);

            const nations = await new NationsService().getAllNations(skip, limit, searchValue);

            return res.render("admin-nation", {
                title: "Nation",
                nations,
                searchValue,
            });
        } catch (error) {
            if (error instanceof Error) res.send(error.message);
        }
    }


    async httpUsers(req: Request, res: Response, next: NextFunction) {
        try {

            const query = req.query as unknown as Query;
            const searchValue = req.query.searchValue as string;

            const { skip, limit } = getPagination(query);

            const users = await new UsersService().getAllUsers(skip, limit, searchValue);


            return res.render("admin-user", {
                title: "User",
                users,
                searchValue,
            });
        } catch (error) {
            if (error instanceof Error) res.send(error.message);
        }
    }

}

export default AdminController;
