import express, { Express, Request, Response, NextFunction } from "express";
import upload from "../config/multerConfig/multerConfig";
import controller from "../controllers/userController";
const router = express.Router();

// [GET] /users # get users
router.get("/", controller.getAllUser);

//[Post] /users/ #create a new user
router.post("/", controller.createUser);

// [PUT] /update/:id  #redirect to my profile page
router.put(
  "/update/:id/:fileUpload",
  upload.single("filename"),
  controller.updateUser
);
// [PUT] /update/:id  #update password
router.put(
  "/update-password/:id",

  controller.updatePassword
);

export = router;
