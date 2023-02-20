import express, { Express, Request, Response, NextFunction } from "express";
import local_strategy from "passport-local";
import bcrypt from "bcryptjs";
import passport from "passport";
const LocalStrategy = local_strategy.Strategy;
const router = express.Router();

// //home page -> not login
// router.get('/',passport.authenticate('local', {
//          successRedirect:'/feeds',
//          failureRedirect:'/login'
//      }), (req: Request, res: Response, next: NextFunction) => {
//     res.send("home page")
// })
router.get("/login", (req: Request, res: Response, next: NextFunction) => {
  res.render("pages/login", { title: "Login Page" });
});
router.get("/signup", (req: Request, res: Response, next: NextFunction) => {
  res.render("pages/signup", { title: "Signup Page" });
});

//logout
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

export = router;
