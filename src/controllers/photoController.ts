import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import mongoose, { Error } from "mongoose";
import { ObjectId } from "mongodb";
import Photo from "../model/photo";
import IUser from "../interface/user";
import { S3 } from "aws-sdk";
import initBucket from "../service/initBucket";
import { uploadToS3 } from "../service/uploadToS3";
import { uptime } from "os";

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
      const list = await Photo.find({ deleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(newLimit)
        .exec();
      const objectlist = list.map((photo) => {
        return photo.toObject();
      });
      const listRoot = await Photo.find({ deleted: false }).exec();

      const pages = Math.ceil(Number(listRoot.length) / newLimit);
      return res.render("admin/adminphoto", {
        title: "Admin Photos",
        user: req.user,
        data: objectlist,
        currentPage: newPage,
        totalPage: pages,
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
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
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
      image: uplaodRes.data,
      desc,
      deleted: false,
      title,
      user: (user as IUser)._id,
    });

    return photo
      .save()
      .then((result) => {
        res.redirect("/me/photos?page=1&limit=20");
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          error,
        });
      });
  } else {
    res.json({ sttaus: false, message: "upload image failed" });
  }
};

// [PUT] #update photo
const updatePhoto = async (req: Request, res: Response, next: NextFunction) => {
  let { fileUpload } = req.params;

  // image upload no change
  if (fileUpload === "false") {
    //update desc, title, status in db
    try {
      const result = await Photo.updateOne({ _id: req.params.id }, req.body);
      return res.redirect("/me/photos?page=1&limit=20");
    } catch (error: any) {
      return res.send(error.message);
    }
  } else {
    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    // Initialize bucket
    await initBucket(s3);

    const uplaodRes = await uploadToS3(s3, req.file);
    const { status, desc, title } = req.body;
    // uplaodRes.data
    const param = {
      image: uplaodRes.data,
      status,
      desc,
      title,
    };
    //if upload image to s3 is success
    if (uplaodRes.success) {
      return Photo.updateOne({ _id: req.params.id }, param)
        .then((result) => {
          res.redirect("/me/photos?page=1&limit=20");
        })
        .catch((error) => {
          return res.status(500).json({
            message: error.message,
            error,
          });
        });
    } else {
      res.json({ sttaus: false, message: "upload image failed" });
    }
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
        const list = await Photo.find({
          user: (user as IUser)._id,
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
        const listRoot = await Photo.find({
          user: (user as IUser)._id,
          deleted: false,
        }).exec();
        const pages = Math.ceil(Number(listRoot.length) / newLimit);
        console.log("page number ", pages);
        res.render("pages/myphoto", {
          title: "My Photos",
          user: req.user,
          data: objectlist,
          currentPage: newPage,
          totalPage: pages,
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

  res.render("pages/updatemyphoto", {
    title: "Edit Photo",
    user: req.user,
    status: true,
    photo,
  });
};

// #delete a photo
const deletephoto = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  //update atb deleted = false
  Photo.findByIdAndUpdate(id, { deleted: true }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      //update successfully
      //redict my photo
      res.redirect("/me/photos?page=1&limit=20");
    }
  });
};

export default {
  getAllPhoto,
  createPhoto,
  getPhotoByEmail,
  goToAddPage,
  goToEditPage,
  deletephoto,
  updatePhoto,
};
