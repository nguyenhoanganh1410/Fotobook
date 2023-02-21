import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import feedController from "../controllers/feedController";
import photoController from "../controllers/photoController";
import IUser from "../interface/user";
const router = express.Router();

// [GET] /feeds/

//check authorized
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const { user } = req;

    if ((user as IUser).role === "admin") {
      res.send("admin page");
    }
    next();
  } else {
    res.redirect("/login");
  }
});
router.get("/", feedController.getData);

export = router;
