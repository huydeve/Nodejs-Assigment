import { NextFunction, Request, Response } from "express";
import NationsDAO from "../services/nations.service";
import { getPagination } from "../utils/query";
import { NationQuery, Query } from "../types/nationQuery";
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



            const dataPlayers = await new PlayersService().getAllPlayers(query);
            const dataNations = await new NationsService().getAllNations({ limit: 300 });

            return res.render("admin-player", {
                title: "Player",
                players: dataPlayers.players,
                totalPage: dataPlayers.totalPage,
                currentPage: dataPlayers.currentPage,
                ellipsisEnd: dataPlayers.ellipsisEnd,
                ellipsisStart: dataPlayers.ellipsisStart,
                end: dataPlayers.end,
                start: dataPlayers.start,
                limit: dataPlayers.limit,
                searchValue,
                positions,
                clubs,
                nations: dataNations.nations,
                errorMessage:req.flash('error')
            });
        } catch (error) {
            if (error instanceof Error) res.send(error.message);
        }
    }

    async httpNations(req: Request, res: Response, next: NextFunction) {
        try {

            const query = req.query as unknown as NationQuery;
            const searchValue = req.query.seachValue as string;


            const data = await new NationsService().getAllNations(query);

            return res.render("admin-nation", {
                title: "Nation",
                nations: data.nations,
                totalPage: data.totalPage,
                currentPage: data.currentPage,
                ellipsisEnd: data.ellipsisEnd,
                ellipsisStart: data.ellipsisStart,
                end: data.end,
                start: data.start,
                searchValue,
                limit: data.limit,
                errorMessage:req.flash('error')

            });
        } catch (error) {
            if (error instanceof Error) res.send(error.message);
        }
    }


    async httpUsers(req: Request, res: Response, next: NextFunction) {
        try {

            const query = req.query as unknown as Query;
            const searchValue = req.query.searchValue as string;

            // const { skip, limit } = getPagination(query);

            const data = await new UsersService().getAllUsers(query);


            return res.render("admin-user", {
                title: "User",
                users: data.users,
                totalPage: data.totalPage,
                currentPage: data.currentPage,
                ellipsisEnd: data.ellipsisEnd,
                ellipsisStart: data.ellipsisStart,
                end: data.end,
                start: data.start,
                searchValue,
                limit: data.limit,
                errorMessage:req.flash('error')

            });
        } catch (error) {
            if (error instanceof Error) res.send(error.message);
        }
    }

}

export default AdminController;
