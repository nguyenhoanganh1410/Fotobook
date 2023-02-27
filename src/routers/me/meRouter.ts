import express, { Express, Request, Response, NextFunction } from "express";
import albumController from "../../controllers/albumController";
import photoController from "../../controllers/photoController";
import userController from "../../controllers/userController";

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

// [GET] /me/album/ #redict add my album page
router.get("/albums/", albumController.getAlbumsByEmail);

// [GET] /me/album/add #redict add my album page
router.get("/album/add-album", albumController.goToAddPage);

// [GET] me/album/:id/edit  #redirect to edit page (my photo)
router.get("/album/:id/edit", albumController.goToEditPage);

// [GET] me/profile/:id  #redirect to my profile page
router.get("/profile/:id", userController.getUser);




export default router;
