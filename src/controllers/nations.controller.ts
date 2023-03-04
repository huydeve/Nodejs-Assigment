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

      // const { skip, limit } = getPagination(query);

      const data = await nationsDao.getAllNations(query);

      return res.render("nation", {
        title: "Nation",
        searchValue,
        nations: data.nations,
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

  async httpGetAllNations(req: Request, res: Response, next: NextFunction) {
    const nationsDao = new NationsDAO();
    try {
      const query = req.query as unknown as Query;
      const data = await nationsDao.getAllNations(query);

      res.send(data.nations);
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
      const { description, name } = req.body as INation;
      let imageUrl: string = '';
      const nationsDao = new NationsDAO();
      if (req.file)
        imageUrl = await uploadImage(req.file)
      await nationsDao.insertNation({ name, description, image: imageUrl });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);

        req.flash('error', error.message);
      }
    }
    finally {
      return res.redirect("/admin/nations");

    }
  }

  async httpRemoveNation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const nationsDao = new NationsDAO();
      await nationsDao.deleteNation(id);
      res.redirect("/admin/nations");
    } catch (error) {

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
    } catch (error) {
      if (error instanceof Error) {
        req.flash('error', error.message);
      }

    }
    finally {
      return res.redirect("/admin/nations");

    }
  }
}

export default NationsController;
