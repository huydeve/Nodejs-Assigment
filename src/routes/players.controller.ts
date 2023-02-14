import { NextFunction, Request, Response } from "express";
import { getPagination } from "../services/query";
import { Query } from "../types/nationQuery";
import PlayersDAO from "../models/players.dao";
import PlayersDTO from "../models/players.dto";
import NationsDAO from "../models/nations.dao";

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

class PlayersController {
  async httpPlayerPage(req: Request, res: Response) {
    const playersDao = new PlayersDAO();
    const nationsDao = new NationsDAO();
    try {
      const query = req.query as unknown as Query;
      const name = req.query.name as string;

      const { skip, limit } = getPagination(query);
      const nations = await nationsDao.getAllNations(0, 300, "");
      const players = await playersDao.getAllPlayers(skip, limit, name);
      return res.render("player", {
        title: "Player",
        searchValue: name,
        players,
        positions,
        clubs,
        nations,
      });
    } catch (error) {
      return res.send("error");
    }
  }

  async httpGetAllPlayers(req: Request, res: Response, next: NextFunction) {
    const playersDao = new PlayersDAO();
    try {
      const query = req.query as unknown as Query;
      const name = req.query.name as string;
      const { skip, limit } = getPagination(query);
      const players = await playersDao.getAllPlayers(skip, limit, name);

      res.send(players);
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpGetPlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const playersDao = new PlayersDAO();
      const player = await playersDao.getPlayer(id);
      res.send(player);
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpCreatePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const isCaptain = req.body.isCaptain === "true";
      const { name, club, goals, image, position, nation } =
        req.body as PlayersDTO;
      const playersDao = new PlayersDAO();
      await playersDao.insertPlayer({
        nation,
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
      const playersDao = new PlayersDAO();
      await playersDao.deletePlayer(id);
      res.redirect("/players/page");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpUpdatePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const player: PlayersDTO = req.body;
      const playersDao = new PlayersDAO();
      await playersDao.updatePlayer(id, player);
      res.redirect("/players/page");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }
}

export default PlayersController;
