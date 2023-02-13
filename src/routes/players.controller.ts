import { NextFunction, Request, Response } from "express";
import { getPagination } from "../services/query";
import { Query } from "../types/nationQuery";
import PlayersDAO from "../models/Players.dao";
import PlayersDTO from "../models/Players.dto";

class PlayersController {
  async httpPlayerPage(req: Request, res: Response) {
    const PlayersDao = new PlayersDAO();
    try {
      const query = req.query as unknown as Query;
      const name = req.query.name as string;

      const { skip, limit } = getPagination(query);

      const Players = await PlayersDao.getAllPlayers(skip, limit, name);
      return res.render("player", {
        title: "Player",
        searchValue: name,
        // Players,
      });
    } catch (error) {
      return res.send("error");
    }
  }

  async httpGetAllPlayers(req: Request, res: Response, next: NextFunction) {
    const PlayersDao = new PlayersDAO();
    try {
      const query = req.query as unknown as Query;
      const name = req.query.name as string;
      const { skip, limit } = getPagination(query);
      const Players = await PlayersDao.getAllPlayers(skip, limit, name);

      res.send(Players);
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpGetPlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const PlayersDao = new PlayersDAO();
      const Player = await PlayersDao.getPlayer(id);
      res.send(Player);
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpCreatePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, club, goals, image, isCaptain, position } =
        req.body as PlayersDTO;
      const PlayersDao = new PlayersDAO();
      await PlayersDao.insertPlayer({
        name,
        club,
        goals,
        image,
        isCaptain,
        position,
      });
      res.redirect("/players/page");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpRemovePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const PlayersDao = new PlayersDAO();
      await PlayersDao.deletePlayer(id);
      res.redirect("/players/page");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpUpdatePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const Player: PlayersDTO = req.body;
      const PlayersDao = new PlayersDAO();
      await PlayersDao.updatePlayer(id, Player);
      res.redirect("/players/page");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }
}

export default PlayersController;
