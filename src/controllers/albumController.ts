import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import mongoose, { Error } from "mongoose";
import { ObjectId } from "mongodb";
import IUser from "../interface/user";
import { S3 } from "aws-sdk";
import initBucket from "../service/initBucket";
import { uploadToS3 } from "../service/uploadToS3";
import Album from "../model/album";
import { request } from "http";

interface Query {
  page: string;
  limit: string;
}

interface QueryAlbum {
  deleteiImageInRoot: string;
  changeInputUpload: string;
  arr: string;
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
      user: (user as IUser)._id,
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

        const listRoot = await Album.find({
          user: (user as IUser)._id,
          deleted: false,
        }).exec();
        const pages = Math.ceil(Number(listRoot.length) / newLimit);
        res.render("pages/myalbum", {
          title: "My Albums",
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
const goToAddPage = (req: Request, res: Response) => {
  res.render("pages/addmyalbum", {
    title: "Add Album",
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
  const album = await Album.findById(new ObjectId(req.params.id)).exec();

  res.render("pages/updatemyalbum", {
    title: "Edit Album",
    user: req.user,
    status: true,
    album,
  });
};

// #delete a ablum
const deleteAlbum = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  //update atb deleted = false
  Album.findByIdAndUpdate(id, { deleted: true }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      //update successfully
      //redict my photo
      res.redirect("/me/albums?page=1&limit=20");
    }
  });
};

// [GET] #get all photos
const getAllALbum = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query as unknown as Query;

  if (page) {
    const newPage = parseInt(page);
    const newLimit = parseInt(limit);
    const skip = (newPage - 1) * newLimit;
    try {
      const list = await Album.find({ deleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(newLimit)
        .exec();
      const objectlist = list.map((photo) => {
        return photo.toObject();
      });
      const listRoot = await Album.find({ deleted: false }).exec();

      const pages = Math.ceil(Number(listRoot.length) / newLimit);
      return res.render("admin/adminalbum", {
        title: "Admin Albums",
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

// [PUT] #update photo
const updateAlbum = async (req: Request, res: Response, next: NextFunction) => {
  const { deleteiImageInRoot, changeInputUpload, arr } =
    req.query as unknown as QueryAlbum;
  const { status, desc, title } = req.body;
  // get album by id
  const album = await Album.findById(new ObjectId(req.params.id)).exec();

  // image upload no change
  if (deleteiImageInRoot === "false" && changeInputUpload === "false") {
    //update desc, title, status in db
    try {
      const result = await Album.updateOne({ _id: req.params.id }, req.body);
      return res.redirect("/me/albums?page=1&limit=20");
    } catch (error: any) {
      return res.send(error.message);
    }
  } else if (deleteiImageInRoot === "true" && changeInputUpload === "false") {
    //xóa ảnh gốc (ảnh đã lưu trongg db)
    //params arr có dạng 34847932479324, 424802942040923 (giữ những ảnh có id này) -> id hình ảnh trong album

    const newArr = arr.split(",");
    const imageList = album?.images.filter((img) => {
      for (let i = 0; i < newArr.length; i++) {
        console.log("_id", img._id);
        console.log("arrnewm", newArr[i]);

        if (img._id.toString() === newArr[i]) {
          return img;
        }
      }
    });

    //update in db
    const param = {
      images: imageList,
      status,
      desc,
      title,
    };

    try {
      const result = await Album.updateOne({ _id: req.params.id }, param);
      return res.redirect("/me/albums?page=1&limit=20");
    } catch (error: any) {
      return res.send(error.message);
    }
  } else if (deleteiImageInRoot === "false" && changeInputUpload === "true") {
    console.log("run case 3");
    //TH3 - thêm mới hình ảnh vào danh sách
    // get album by id

    if (req.files && album) {
      //tạo 1 mảng tạm lưu trữ danh sach các image trong đối tượng gốc
      Object.entries(req.files).forEach((month) => {
        album.images.push({
          _id: new mongoose.Types.ObjectId(),
          url: month[1].path.substring(11, month[1].path.length),
        });
        console.log(month[1].path.substring(11, month[1].path.length));
      });

      //update in db
      const param = {
        images: album.images,
        status,
        desc,
        title,
      };
      try {
        const result = await Album.updateOne({ _id: req.params.id }, param);
        return res.redirect("/me/albums?page=1&limit=20");
      } catch (error: any) {
        return res.send(error.message);
      }
    }
  } else if (deleteiImageInRoot === "true" && changeInputUpload === "true") {
    //TH4 - Thêm mới hình ảnh và xóa ảnh cũ ( ảnh cũ là ảnh đã có trong db)
    const newArr = arr.split(",");
    const imageList = album?.images.filter((img) => {
      for (let i = 0; i < newArr.length; i++) {
        console.log("_id", img._id);
        console.log("arrnewm", newArr[i]);

        if (img._id.toString() === newArr[i]) {
          return img;
        }
      }
    });

    if (req.files && imageList) {
      //tạo 1 mảng tạm lưu trữ danh sach các image trong đối tượng gốc
      Object.entries(req.files).forEach((month) => {
        imageList.push({
          _id: new mongoose.Types.ObjectId(),
          url: month[1].path.substring(11, month[1].path.length),
        });
        console.log(month[1].path.substring(11, month[1].path.length));
      });

      //update in db
      const param = {
        images: imageList,
        status,
        desc,
        title,
      };
      try {
        const result = await Album.updateOne({ _id: req.params.id }, param);
        return res.redirect("/me/albums?page=1&limit=20");
      } catch (error: any) {
        return res.send(error.message);
      }
    }
  }
};

export default {
  createAlbum,
  getAlbumsByEmail,
  goToAddPage,
  goToEditPage,
  deleteAlbum,
  getAllALbum,
  updateAlbum,
};
