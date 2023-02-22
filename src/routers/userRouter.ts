import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import controller from "../controllers/userController";
const router = express.Router();

// [GET] /users # get users
router.get("/", controller.getAllUser);

//[Post] /users/ #create a new user
router.post("/", controller.createUser);

export = router;
