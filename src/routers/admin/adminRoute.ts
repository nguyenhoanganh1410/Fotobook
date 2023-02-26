import express, { Express, Request, Response, NextFunction } from "express";
import albumController from "../../controllers/albumController";
import photoController from "../../controllers/photoController";

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

export default router;
