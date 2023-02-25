import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import mongoose, { Error } from "mongoose";
import { ObjectId } from "mongodb";
import IUser from "../interface/user";
import { S3 } from "aws-sdk";
import initBucket from "../service/initBucket";
import { uploadToS3 } from "../service/uploadToS3";
import Album from "../model/album";

interface Query {
  page: string;
  limit: string;
}

// [POST] #create a new album
const createAlbum = async (req: Request, res: Response, next: NextFunction) => {
  let { desc, title, status, images } = req.body;
  const { user } = req;

  if (req.files) {
    const album = new Album({
      _id: new mongoose.Types.ObjectId(),
      status,
      desc,
      deleted: false,
      title,
      userEmail: (user as IUser).email,
    });

    Object.entries(req.files).forEach((month) => {
      album.images.push({
        _id: new mongoose.Types.ObjectId(),
        url: month[1].path.substring(11, month[1].path.length),
      });
      // console.log(month[1].path.substring(11, month[1].path.length));
    });

    return album
      .save()
      .then((result) => {
        res.redirect("/me/albums?page=1&limit=20");
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          error,
        });
      });
  }

  return res.json("file is empty!!");
};

// [GET] #get albums by email
const getAlbumsByEmail = async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const { user } = req;
    const { page, limit } = req.query as unknown as Query;

    if (page) {
      const newPage = parseInt(page);
      const newLimit = parseInt(limit);
      const skip = (newPage - 1) * newLimit;
      try {
        const list = await Album.find({
          userEmail: (user as IUser).email,
          deleted: false,
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(newLimit)
          .exec();
        const objectlist = list.map((photo) => {
          return photo.toObject();
        });
        console.log(objectlist);

        const listRoot = await Album.find().exec();

        res.render("pages/myalbum", {
          title: "My Albums",
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
  } else {
    res.redirect("/login");
  }
};

// #redirect add photo page
const goToAddPage = (req: Request, res: Response) => {
  res.render("pages/addmyalbum", {
    title: "Add Album",
    user: req.user,
  });
};

export default { createAlbum, getAlbumsByEmail, goToAddPage };
