import express, { Express, Request, Response, NextFunction } from "express";
import photoController from "../../controllers/photoController";


const router = express.Router();

// [GET] /me/photos/ #get photos by email
router.get("/photos/", photoController.getPhotoByEmail);

// [GET] me/photos/:id/edit  #redirect to edit page (my photo)
router.get("/photo/:id/edit", photoController.goToEditPage);

// [GET] /me/photos/add #redict add my photo page
router.get("/photo/add-photo", photoController.goToAddPage);

router.get("/photos/list", photoController.getAllPhoto);

// [POST] /me/photos/ #add photo
router.post("/photos/add", photoController.createPhoto);

export default router;
