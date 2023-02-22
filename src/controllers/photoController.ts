import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import Photo from "../model/photo";
import IUser from "../interface/user";
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

// [GET] /photos/list?page=1&limit=20
const getPhotoByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    const { user } = req;
    const { page, limit } = req.query as unknown as Query;

    if (page) {
      const newPage = parseInt(page);
      const newLimit = parseInt(limit);
      const skip = (newPage - 1) * newLimit;
      try {
        const list = await Photo.find({ userEmail: (user as IUser).email })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(newLimit)
          .exec();
        const objectlist = list.map((photo) => {
          return photo.toObject();
        });
        const listRoot = await Photo.find().exec();

        res.render("pages/myphoto", {
          title: "My Photos",
          user: req.user,
          data: objectlist,
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

    //res.render("pages/myphoto", { title: "My Photo", user: req.user });
  } else {
    res.redirect("/login");
  }
};

const goToAddPage = (req: Request, res: Response, next: NextFunction) => {
  console.log("add");

  return res.send("add page");
};

export default { getAllPhoto, createPhoto, getPhotoByEmail, goToAddPage };
