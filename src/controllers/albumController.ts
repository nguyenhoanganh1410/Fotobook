import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import mongoose, { Error } from "mongoose";
import { ObjectId } from "mongodb";
import IUser from "../interface/user";
import { S3 } from "aws-sdk";
import initBucket from "../service/initBucket";
import { uploadToS3 } from "../service/uploadToS3";
import Album from "../model/album";
import { image } from "../interface/album";

interface Query {
  page: string;
  limit: string;
}

// [POST] #create a new album
const createAlbum = async (req: Request, res: Response, next: NextFunction) => {
  let { desc, title, status, images, userEmail } = req.body;
  const { user } = req;
  console.log(user);

  const album = new Album({
    _id: new mongoose.Types.ObjectId(),
    status,
    desc,
    deleted: false,
    title,
    userEmail,
  });
  for (let i of images) {
    album.images.push({
      _id: new mongoose.Types.ObjectId(),
      url: i.url,
    });
  }

  console.log(album);

  return album
    .save()
    .then((result) => {
      res.send("thanh cong");
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error,
      });
    });

  // const s3 = new S3({
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // });

  // // Initialize bucket
  // await initBucket(s3);

  // const uplaodRes = await uploadToS3(s3, req.file);

  // //if upload image to s3 is success
  // if (uplaodRes.success) {
  //   const photo = new Photo({
  //     _id: new mongoose.Types.ObjectId(),
  //     status,
  //     image: uplaodRes.data,
  //     desc,
  //     deleted: false,
  //     title,
  //     userEmail: (user as IUser).email,
  //   });

  // return photo
  //   .save()
  //   .then((result) => {
  //     res.redirect("/me/photos?page=1&limit=20");
  //   })
  //   .catch((error) => {
  //     return res.status(500).json({
  //       message: error.message,
  //       error,
  //     });
  //     });
  // } else {
  //   res.json({ sttaus: false, message: "upload image failed" });
  // }
};

// [GET] #get albums by email
const getAlbumsByEmail = async (
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
const goToAddPage = (req: Request, res: Response, next: NextFunction) => {
  res.render("pages/addmyalbum", {
    title: "Add Album",
    user: req.user,
  });
};

export default { createAlbum, getAlbumsByEmail, goToAddPage };
