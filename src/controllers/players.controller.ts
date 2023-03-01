import { NextFunction, Request, Response } from "express";
import { getPagination } from "../utils/query";
import { Query } from "../types/nationQuery";
import PlayersDAO from "../services/players.service";
import NationsDAO from "../services/nations.service";
import { IPlayer } from "../models/players.mongo";
import { uploadImage } from "../configs/firebase.config";

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
      const searchValue = req.query.searchValue as string;

      const { skip, limit } = getPagination(query);
      const nations = await nationsDao.getAllNations(0, 300, "");
      const players = await playersDao.getAllPlayers(skip, limit, searchValue, true);
      return res.render("player", {
        title: "Player",
        searchValue,
        players,
        positions,
        clubs,
        nations,
      });
    } catch (error) {
      return res.send("error");
    }
  }


  async httpPlayerDetailPage(req: Request, res: Response) {
    const playersDao = new PlayersDAO();
    const nationsDao = new NationsDAO();
    try {
      const { id } = req.params


      const player = await playersDao.getPlayer(id)


      return res.render("player-detail", {
        title: "Player detail page",
        player,
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
      const players = await playersDao.getAllPlayers(skip, limit, name, true);

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
      const isCaptain = req.body.isCaptain === "on";

      const playersDao = new PlayersDAO();
      let imageUrl: string = '';
      const { name, club, goals, position, nation } =
        req.body;
      if (req.file)
        imageUrl = await uploadImage(req.file)
      await playersDao.insertPlayer({
        nation,
        name,
        club,
        goals,
        image: imageUrl,
        isCaptain,
        position,
      });
      return res.redirect("/admin/players");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpRemovePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const playersDao = new PlayersDAO();
      await playersDao.deletePlayer(id);
      res.redirect("/admin/players");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpUpdatePlayer(req: Request, res: Response, next: NextFunction) {
    try {

      const player = req.body;
      const isCaptain = req.body.isCaptain === "on";

      let imageUrl: string = '';
      const playersDao = new PlayersDAO();
      if (req.file) imageUrl = await uploadImage(req.file)

      await playersDao.updatePlayer(player.id, {
        ...player,
        isCaptain,
        image: imageUrl.length > 0 ? imageUrl : req.body.image
      });
      return res.redirect("/admin/players");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }
}

export default PlayersController;
