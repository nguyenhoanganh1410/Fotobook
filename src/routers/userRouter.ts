import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import controller from "../controllers/userController";
const router = express.Router();

//get all user
router.get("/", controller.getAllUser);

//signup
router.post("/", controller.createUser);

export = router;
