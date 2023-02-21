import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
const router = express.Router();
import photoController from "../controllers/photoController";

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
router.get("/list", photoController.getAllPhoto);
router.post("/", photoController.createPhoto);
export default router;
