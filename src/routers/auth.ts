import express, { Express, Request, Response, NextFunction } from "express";
import local_strategy from "passport-local";
import bcrypt from "bcryptjs";
import passport from "passport";
import IUser from "../interface/user";
const LocalStrategy = local_strategy.Strategy;
const router = express.Router();

//[GET] / #goto feed page
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

//[GET] /login # go to login page
router.get("/login", (req: Request, res: Response, next: NextFunction) => {
  res.render("pages/login", { title: "Login Page" });
});

//[get] /signup # go to signup page
router.get("/signup", (req: Request, res: Response, next: NextFunction) => {
  res.render("pages/signup", { title: "Signup Page" });
});

//[GET] /logout
router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  console.log(" user logged out");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

// [post] /login
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err: any, user: any) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("pages/login", {
        message: "Username or password is not correct!!",
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/feeds?type=photo&page=1&limit=4");
    });
  })(req, res, next);
});

export = router;
