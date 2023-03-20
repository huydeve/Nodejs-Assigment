import { NextFunction, Request, Response } from "express";
import NationsDAO from "../services/nations.service";
import { getPagination } from "../utils/query";
import { NationQuery, Query, UserQuery } from "../types/nationQuery";
import { INation } from "../models/nations.mongo";
import NationsService from "../services/nations.service";
import PlayersService from "../services/players.service";
import UsersService from "../services/users.service";
import { clubs, positions } from "../utils/dataFake";

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
            const q = req.query.q as string;



            const dataPlayers = await new PlayersService().getAllPlayers(query);
            const dataNations = await new NationsService().getAllNations({ limit: 300 });
            return res.render("admin-player", {
                title: "Player",
                ...dataPlayers,
                q,
                positions,
                clubs,
                nations: dataNations.nations,
                errorMessage: req.flash('error')
            });
        } catch (error) {
            if (error instanceof Error) res.send(error.message);
        }
    }

    async httpNations(req: Request, res: Response, next: NextFunction) {
        try {

            const query = req.query as unknown as NationQuery;
            const q = req.query.q as string;


            const data = await new NationsService().getAllNations(query);

            return res.render("admin-nation", {
                title: "Nation",
                ...data,
                q,
                errorMessage: req.flash('error')

            });
        } catch (error) {
            if (error instanceof Error) res.send(error.message);
        }
    }

    async httpUsers(req: Request, res: Response, next: NextFunction) {
        try {

            const query = req.query as unknown as UserQuery;
            const q = req.query.q as string;
            const user = req.session.passport.user.profile.email
            // const { skip, limit } = getPagination(query);

            const data = await new UsersService().getAllUsers(query, user);


            return res.render("admin-user", {
                title: "User",
                users: data.users,
                totalPage: data.totalPage,
                currentPage: data.currentPage,
                ellipsisEnd: data.ellipsisEnd,
                ellipsisStart: data.ellipsisStart,
                maxValue: 120,
                maxDefault: 50,
                end: data.end,
                start: data.start,
                q,
                limit: data.limit,
                errorMessage: req.flash('error')

            });
        } catch (error) {
            if (error instanceof Error) res.send(error.message);
        }
    }

}

export default AdminController;
