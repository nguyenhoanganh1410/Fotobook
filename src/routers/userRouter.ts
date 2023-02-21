import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import controller from "../controllers/userController";
const router = express.Router();

router.get("/", controller.getAllUser);
//signup
router.post("/", controller.createUser);
// router.post('/login',passport.authenticate('local', {
//     successRedirect: '/feeds',
//     failureRedirect: '/login'
// }), (req, res) => {
//     try {
//         res.send("login sucessfull")
//     } catch (error) {
//         res.send("login fail")
//     }
// });

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
