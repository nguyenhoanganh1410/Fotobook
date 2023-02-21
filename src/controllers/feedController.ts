import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import Photo from "../model/photo";
import mutipleMongooseToObject from "../utils/mongoose";
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

      // console.log(list);
      // console.log(typeof list);

      const listRoot = await Photo.find().exec();
      // return res.status(200).json({
      //   photos: list,
      //   count: list.length,
      //   currentPage: newPage,
      //   totalPage: Math.ceil(listRoot.length / newLimit),
      // });
      res.render("pages/feed", {
        title: "FotoBook",
        user: req.user,
        data: mutipleMongooseToObject,
        currentPage: newPage,
        totalPage: Math.ceil(listRoot.length / newLimit),
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "erro",
        //error
      });
    }
  }
};

export default { getData };
