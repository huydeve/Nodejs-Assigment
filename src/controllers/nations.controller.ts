import { NextFunction, Request, Response } from "express";
import NationsDAO from "../services/nations.service";
import { getPagination } from "../utils/query";
import { Query } from "../types/nationQuery";
import { INation } from "../models/nations.mongo";
import { uploadImage } from "../configs/firebase.config";

class NationsController {
  async httpNationPage(req: Request, res: Response) {
    const nationsDao = new NationsDAO();
    try {
      const query = req.query as unknown as Query;
      const searchValue = req.query.searchValue as string;

      const { skip, limit } = getPagination(query);

      const nations = await nationsDao.getAllNations(skip, limit, searchValue);

      return res.render("nation", {
        title: "Nation",
        searchValue,
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
      const { description, name, image } = req.body as INation;
      let imageUrl: string = '';
      const nationsDao = new NationsDAO();
      if (req.file)
        imageUrl = await uploadImage(req.file)
      await nationsDao.insertNation({ name, description, image: imageUrl });
      return res.redirect("/admin/nations");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpRemoveNation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const nationsDao = new NationsDAO();
      await nationsDao.deleteNation(id);
      res.redirect("/admin/nations");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }

  async httpUpdateNation(req: Request, res: Response, next: NextFunction) {
    try {
      const nation = req.body;
      const nationsDao = new NationsDAO();
      let imageUrl: string = '';
      if (req.file)
        imageUrl = await uploadImage(req.file)

      await nationsDao.updateNation(nation.id, {
        ...nation,
        image: imageUrl.length > 0 ? imageUrl : nation.image
      });
      return res.redirect("/admin/nations");
    } catch (error) {
      if (error instanceof Error) res.send(error.message);
    }
  }
}

export default NationsController;
