import { NextFunction, Request, Response } from "express";
import { getPagination } from "../utils/query";
import { PlayerQuery, Query } from "../types/nationQuery";
import PlayersDAO from "../services/players.service";
import NationsDAO from "../services/nations.service";
import { IPlayer } from "../models/players.mongo";
import { uploadImage } from "../configs/firebase.config";
import NationsService from "../services/nations.service";

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
      const q = req.query.q as string;

      const data = await playersDao.getAllPlayers({ ...query });
      const nationData = await new NationsService().getAllNations({ limit: 300 });

      console.log(data.limit);


      return res.render("player", {
        title: "Player",
        q,
        positions,
        clubs,
        maxValue: 1000,
        nations: nationData.nations,
        ...data,
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
      const query = req.query as unknown as PlayerQuery;
      const isCaptain = req.query.isCaptain

      if (typeof query.isCaptain !== "undefined") {
        query.isCaptain = isCaptain === "on"
      }
      const data = await playersDao.getAllPlayers(query);
      const nationData = await new NationsService().getAllNations({ limit: 300 });
      const URL = req.originalUrl.split("/filter?")[0]

      return res.render("component/player-row.ejs", {
        q: query.q,
        positions,
        clubs,
        maxValue: 1000,
        nations: nationData.nations,
        errorMessage: req.flash('error'),
        ...data,
        URL
      });
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
