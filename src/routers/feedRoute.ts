import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
const router = express.Router();

// [GET] /feeds/
// home page - authorized
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    console.log("user" + req.user);
    res.render("pages/feed", { title: "FotoBook", user: req.user });
  } else {
    res.redirect("/login");
    // res.render('pages/login' ,{ title: 'FotoBook Login' })
  }
});

export = router;
