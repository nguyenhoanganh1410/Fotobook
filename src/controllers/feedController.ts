import { log } from "console";
import { NextFunction, Request, Response } from "express";
import Photo from "../model/photo";
interface Query {
  page: string;
  limit: string;
  type: string;
}

// [GET] /feeds?type=photo&page=1&limit=3
const getData = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, type } = req.query as unknown as Query;

  //featch data is photo
  if (page && type === "photo") {
    const newPage = parseInt(page);
    const newLimit = parseInt(limit);
    const skip = (newPage - 1) * newLimit;
    try {
      const list = await Photo.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(newLimit)
        .exec();

      const newList = list.map((photo) => {
        return photo.toObject();
      });

      const listRoot = await Photo.find().exec();
      res.render("pages/feed", {
        title: "FotoBook",
        user: req.user,
        data: newList,
        currentPage: newPage,
        totalPage: Math.ceil(listRoot.length / newLimit),
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "erro",
      });
    }
  }
};

export default { getData };
