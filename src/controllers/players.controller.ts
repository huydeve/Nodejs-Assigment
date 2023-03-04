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
    try {
      const query = req.query as unknown as Query;
      const searchValue = req.query.searchValue as string;

      const data = await playersDao.getAllPlayers({ ...query, isCaptain: true });
      console.log(data);

      return res.render("player", {
        title: "Player",
        searchValue,
        players: data.players,
        totalPage: data.totalPage,
        currentPage: data.currentPage,
        ellipsisEnd: data.ellipsisEnd,
        ellipsisStart: data.ellipsisStart,
        end: data.end,
        start: data.start,
        limit: data.limit,

      });
    } catch (error) {
      return res.send("error");
    }
  }


  async httpPlayerDetailPage(req: Request, res: Response) {
    const playersDao = new PlayersDAO();
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
      const players = await playersDao.getAllPlayers(query);

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
      const { name, club, goals, position, nation, career } =
        req.body;
      console.log(req.body);

      if (req.file)
        imageUrl = await uploadImage(req.file)
      await playersDao.insertPlayer({
        career,
        nation,
        name,
        club,
        goals,
        image: imageUrl,
        isCaptain,
        position,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('dup key')) {
          req.flash('error', "Name is already in use")
        }
      }

    }
    finally {
      return res.redirect("/admin/players");

    }
  }

  async httpRemovePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const playersDao = new PlayersDAO();
      await playersDao.deletePlayer(id);
      res.redirect("/admin/players");
    } catch (error) {

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
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('dup key')) {
          req.flash('error', "Name is already in use")
        }
        req.flash('error', error.message)

      }

    }
    finally {
      return res.redirect("/admin/players");

    }
  }
}

export default PlayersController;
