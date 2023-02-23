import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import Photo from "../model/photo";
import IUser from "../interface/user";
import { S3 } from "aws-sdk";
import initBucket from "../service/initBucket";
import { uploadToS3 } from "../service/uploadToS3";

interface Query {
  page: string;
  limit: string;
}

// [GET] #get all photos
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

// [POST] #create a new photo
const createPhoto = async (req: Request, res: Response, next: NextFunction) => {
  let { desc, title, status } = req.body;
  const { user } = req;

  const s3 = new S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  // Initialize bucket
  await initBucket(s3);

  const uplaodRes = await uploadToS3(s3, req.file);

  //if upload image to s3 is success
  if (uplaodRes.success) {
    const photo = new Photo({
      _id: new mongoose.Types.ObjectId(),
      status,
      image : uplaodRes.data,
      desc,
      title,
      userEmail : (user as IUser).email,
    });

    return photo
          .save()
          .then((result) => {
              res.redirect('/me/photos?page=1&limit=20')
          })
          .catch((error) => {
              return res.status(500).json({
                  message: error.message,
                  error
              });
          });
  } else {
    res.json({sttaus: false, message: "upload image failed"});
  }

};

// [GET] #get photos by email
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
        console.log(objectlist);

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
  } else {
    res.redirect("/login");
  }
};

// #redirect add photo page
const goToAddPage = (req: Request, res: Response, next: NextFunction) => {
  res.render("pages/addmyphoto", {
    title: "Add Photo",
    user: req.user,
  });
};

// #redirect edit photo page
const goToEditPage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  

  // get photo by id
  const photo = await Photo.findById(new ObjectId(req.params.id)).exec();
 
  res.render("pages/addmyphoto", {
    title: "Edit Photo",
    user: req.user,
    status: true,
    photo
  });
};

export default {
  getAllPhoto,
  createPhoto,
  getPhotoByEmail,
  goToAddPage,
  goToEditPage,
};
