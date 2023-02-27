import { log } from "console";
import { NextFunction, Request, Response } from "express";
import IUser from "../interface/user";
import Album from "../model/album";
import Photo from "../model/photo";

interface Query {
  page: string;
  limit: string;
  type: string;
}

// [GET] /feeds?type=xxx&page=1&limit=3
const getData = async (req: Request, res: Response, next: NextFunction) => {
  console.log("calal get data");
  const { page, limit, type } = req.query as unknown as Query;

  const newPage = parseInt(page);
  const newLimit = parseInt(limit);
  const skip = (newPage - 1) * newLimit;
  //featch data is photo
  if (type === "photo") {
    try {
      const list = await Photo.find({ status: true, deleted: false })
        .skip(skip)
        .limit(newLimit)
        .sort("createdAt")
        .populate<{ user: IUser }>("user", "firstName lastName avatar");

      const listRoot = await Photo.find({ status: true, deleted: false })
        .sort("createdAt")
        .populate<{ user: IUser }>("user", "firstName lastName avatar");

      res.render("pages/feed", {
        title: "FotoBook",
        user: req.user,
        data: list,
        currentPage: newPage,
        totalPage: Math.ceil(listRoot.length / newLimit),
        type,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  } else {
    //type is album
    try {
      const list = await Album.find({ status: true, deleted: false })
        .skip(skip)
        .limit(newLimit)
        .sort("createdAt")
        .populate<{ user: IUser }>("user", "firstName lastName avatar");

      const listRoot = await Album.find({ status: true, deleted: false })
        .sort("createdAt")
        .populate<{ user: IUser }>("user", "firstName lastName avatar");

      res.render("pages/feed", {
        title: "FotoBook",
        user: req.user,
        data: list,
        currentPage: newPage,
        totalPage: Math.ceil(listRoot.length / newLimit),
        type,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
};

export default { getData };
