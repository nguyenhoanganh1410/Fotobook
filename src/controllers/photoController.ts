import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import Photo from "../model/photo";

interface Query {
  page: string;
  limit: string;
}

// [GET] /photos/list?page=1&limit=3
const getAllPhoto = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query as unknown as Query;

  if (page) {
    const newPage = parseInt(page);
    const newLimit = parseInt(limit);
    const skip = (newPage - 1) * newLimit;
    try {
      const list = await Photo.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(newLimit)
        .exec();

      const listRoot = await Photo.find().exec();
      return res.status(200).json({
        photos: list,
        count: list.length,
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

// [POST] /photos/
const createPhoto = async (req: Request, res: Response, next: NextFunction) => {
  let { image, desc, title, status, userEmail } = req.body;
  console.log(req.body);

  const photo = new Photo({
    _id: new mongoose.Types.ObjectId(),
    status,
    image,
    desc,
    title,
    userEmail,
  });

  return photo
    .save()
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });
};

export default { getAllPhoto, createPhoto };
