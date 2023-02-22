import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import Photo from "../model/photo";
import IUser from "../interface/user";
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
