import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import upload from "../config/multerConfig/multerConfig";
const router = express.Router();
import photoController from "../controllers/photoController";
import { authUser } from "../middleware/auth";

// [GET] /photos/ #get photos by email
router.get("/", photoController.getPhotoByEmail);

router.get("/list", photoController.getAllPhoto);

// [POST] /photos/ #add photo
router.post("/add",upload.single('filename') ,photoController.createPhoto);

export default router;
