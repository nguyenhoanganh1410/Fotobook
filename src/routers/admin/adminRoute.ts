import express, { Express, Request, Response, NextFunction } from "express";
import upload from "../../config/multerConfig/multerConfig";
import albumController from "../../controllers/albumController";
import photoController from "../../controllers/photoController";
import userController from "../../controllers/userController";

const router = express.Router();

// [GET] /admin/photos/ #get all photos
router.get("/photos", photoController.getAllPhoto);

// [GET] admin/photos/:id/edit  #redirect to edit page (my photo)
router.get("/photo/:id/edit", photoController.goToEditPage);

// [GET] /admin/photos/add #redict add my photo page
router.get("/photo/add-photo", photoController.goToAddPage);

router.get("/photos/list", photoController.getAllPhoto);

// [POST] /admin/photos/ #add photo
router.post("/photos/add", photoController.createPhoto);

// [GET] /admin/album/ #redict add my album page
router.get("/albums/", albumController.getAllALbum);

// [GET] /admin/album/add #redict add my album page
router.get("/album/add-album", albumController.goToAddPage);

// [GET] admin/album/:id/edit  #redirect to edit page (my photo)
router.get("/album/:id/edit", albumController.goToEditPage);

// [GET] admin/profile/:id  #redirect to my profile page
router.get("/profile/:id", userController.getUser);

// [GET] /admin/users/ #redict manager users page
router.get("/users/", userController.getAllUser);

// [GET] /admin/edit-user/ #redict edit user page
router.get("/edit-user/:id", userController.goToEditPage);

// [PUT] /update/:id  #redirect to my profile page
router.put(
  "/update-user/:id/:fileUpload",
  upload.single("filename"),
  userController.adminUpdateUser
);

export default router;
