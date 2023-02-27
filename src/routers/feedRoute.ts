import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import feedController from "../controllers/feedController";
import photoController from "../controllers/photoController";
import IUser from "../interface/user";
const router = express.Router();

// [GET] /feeds/ # isAuthenticated? if user is admin -> go to admin page
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const { user } = req;

    if ((user as IUser).role === "admin") {
      res.redirect("/admin/photos?page=1&limit=20");
    }
    next();
  } else {
    console.log("not login");
    res.redirect("/feeds?type=photo&page=1&limit=4");
  }
});

// [GET] /feeds/ #go to feed page (usesr role)
router.get("/", feedController.getData);

export = router;
