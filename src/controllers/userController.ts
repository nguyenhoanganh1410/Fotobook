import { uploadToS3 } from "./../service/uploadToS3";
import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../model/user";
import bcrypt from "bcryptjs";
import { S3 } from "aws-sdk";
import initBucket from "../service/initBucket";
import { emailer } from "../service/email";

// [POST] #create a new account
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  let {
    firstName,
    lastName,
    avatar,
    email,
    password,
    status,
    lastLogin,
    role,
  } = req.body;

  // select user by email
  const u = await User.findOne({ email }).exec();

  if (u) {
    return res.status(400).json({
      message: "User already exists",
    });
  } else {
    const passwordHash = bcrypt.hashSync(password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      email,
      password: passwordHash,
      lastLogin: "",
      avatar: "",
      status: 1,
      role: "user",
    });
    return user
      .save()
      .then((result) => {
        res.render("pages/login", {
          messageSucessfull: "Signin successful, please login!!",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          error,
        });
      });
  }
};

// [GET] /users/ #get all users with deleted = false and role is user
const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await User.find({ deleted: false, role: "user" }).exec();
    res.render("admin/adminusers", {
      title: "Manager users",
      list,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "erro",
      //error
    });
  }
};

// [GET] #get info of a user and redirect profile page
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  // get photo by id
  const user = await User.findById(new ObjectId(req.params.id)).exec();

  res.render("pages/profile", {
    title: "Edit Profile",
    user,
  });
};

// [PUT] #update user profile
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  let { fileUpload } = req.params;
  console.log("fileUpload", fileUpload);
  // image upload no change
  if (fileUpload === "false") {
    //update desc, title, status in db
    try {
      const { firstName, lastName, status } = req.body;

      const result = await User.updateOne({ _id: req.params.id }, req.body);
      return res.redirect("/feeds?type=photo&page=1&limit=4");
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
    const { firstname, lastname } = req.body;
    // uplaodRes.data
    const param = {
      avatar: uplaodRes.data,
      firstname,
      lastname,
    };
    //if upload image to s3 is success
    if (uplaodRes.success) {
      return User.updateOne({ _id: req.params.id }, param)
        .then((result) => {
          return res.redirect("/feeds?type=photo&page=1&limit=4");
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

// [PUT] #update password
const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currentPassword, password } = req.body;
  console.log("new password", password);
  // get user by id
  const user = await User.findById(new ObjectId(req.params.id)).exec();
  if (!user) {
    return res.json("erro");
  } else {
    if (bcrypt.compareSync(currentPassword, user.password)) {
      const passwordHash = bcrypt.hashSync(password, 10);
      const result = await User.updateOne(
        { _id: req.params.id },
        { password: passwordHash }
      );

      return res.redirect("/feeds?type=photo&page=1&limit=4");
    } else {
      // return res.json("mk hien tai chua chinh xac");
      res.render("pages/profile", {
        title: "Edit Profile",
        user,
        message: "Wrong Current Password!!",
      });
    }
  }
};

// #delete a photo
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  //update atb deleted = false
  User.findByIdAndUpdate(id, { deleted: true }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      //update successfully
      //redict my
      res.redirect("/admin/users?page=1&limit=20");
    }
  });
};

// #redirect edit users page
const goToEditPage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get photo by id
  const userFound = await User.findById(new ObjectId(req.params.id)).exec();

  res.render("admin/updateuser", {
    title: "Edit User Profile",
    user: req.user,
    userUpdate: userFound,
  });
};
// [PUT] #update user profile
const adminUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { fileUpload } = req.params;
  console.log("fileUpload", fileUpload);
  // image upload no change
  if (fileUpload === "false") {
    //update desc, title, status in db
    try {
      const { firstName, lastName, status } = req.body;

      const result = await User.updateOne({ _id: req.params.id }, req.body);

      return res.redirect("/admin/users?page=1&limit=20");
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
    const { firstname, lastname, status } = req.body;
    // uplaodRes.data
    const param = {
      avatar: uplaodRes.data,
      firstname,
      lastname,
      status,
    };
    //if upload image to s3 is success
    if (uplaodRes.success) {
      return User.updateOne({ _id: req.params.id }, param)
        .then((result) => {
          return res.redirect("/admin/users?page=1&limit=20");
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
export default {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  updatePassword,
  deleteUser,
  goToEditPage,
  adminUpdateUser,
};
