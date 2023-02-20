import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
const router = express.Router();

// [GET] /photos/
// my photo page - authorized
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    console.log("user" + req.user);
    res.render("pages/myphoto", { title: "My Photo", user: req.user });
  } else {
    res.redirect("/login");
  }
});

export default router;
