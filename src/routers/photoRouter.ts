import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
const router = express.Router();
import photoController from "../controllers/photoController";
import { authUser } from "../middleware/auth";

// [GET] /photos/ #get photos by email
router.get("/", photoController.getPhotoByEmail);

// [GET] /photos/add #redict add my photo page
router.get("/add-photo", authUser ,photoController.goToAddPage);

router.get("/list", photoController.getAllPhoto);

// [POST] /photos/ #add photo
router.post("/add", photoController.createPhoto);

export default router;
