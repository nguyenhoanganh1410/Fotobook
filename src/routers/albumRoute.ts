import express, { Express, Request, Response, NextFunction } from "express";

import upload from "../config/multerConfig/multerConfig";
import createAlbum from "../controllers/albumController";
import albumController from "../controllers/albumController";

import { authUser } from "../middleware/auth";
const router = express.Router();

// [POST] /photos/ #add photo
router.post("/add", upload.array("images", 50), albumController.createAlbum);

// [DELETE] /albums/delete/:id/_method=DELETE  #delete album
router.delete("/delete/:id", albumController.deleteAlbum);

// [PUT] //albums/update/${idUlbum}?deleteiImageInRoot=false&changeInputUpload=false_method=PUT
router.put(
  "/update/:id",
  upload.array("images", 50),
  albumController.updateAlbum
);

export default router;
