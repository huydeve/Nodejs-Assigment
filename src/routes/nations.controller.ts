import { NextFunction, Request, Response } from "express";
import NationsDAO from "../models/nations.dao";
import NationsDTO from "../models/nations.dto";
import { getPagination } from "../services/query";
import { Query } from "../types/nationQuery";

class NationsController {
  async httpNationPage(req: Request, res: Response) {
    const nationsDao = new NationsDAO();
    try {
      const query = req.query as unknown as Query;
      const name = req.query.name as string;

      const { skip, limit } = getPagination(query);

      const nations = await nationsDao.getAllNations(skip, limit, name);
      return res.render("nation", {
        title: "Nation",
        searchValue: name,
        nations,
      });
    } catch (error) {
      return res.send("error");
    }
  }

  async httpGetAllNations(req: Request, res: Response, next: NextFunction) {
    const nationsDao = new NationsDAO();
    try {
      const query = req.query as unknown as Query;
      const name = req.query.name as string;
      const { skip, limit } = getPagination(query);
      const nations = await nationsDao.getAllNations(skip, limit, name);

      res.send(nations);
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpGetNation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const nationsDao = new NationsDAO();
      const nation = await nationsDao.getNation(id);
      res.send(nation);
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpCreateNation(req: Request, res: Response, next: NextFunction) {
    try {
      const { description, name, flagNation } = req.body;
      const nationsDao = new NationsDAO();
      await nationsDao.insertNation({ name, description, flagNation });
      res.redirect("/nations/page");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpRemoveNation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const nationsDao = new NationsDAO();
      await nationsDao.deleteNation(id);
      res.redirect("/nations/page");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpUpdateNation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const nation: NationsDTO = req.body;
      const nationsDao = new NationsDAO();
      await nationsDao.updateNation(id, nation);
      res.redirect("/nations/page");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }
}

export default NationsController;
