import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import photoController from "../../controllers/photoController";
const router = express.Router();


// [GET] /photos/
// my photo page - authorized
router.get("/photos", (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    res.render("pages/myphoto", { title: "My Photo", user: req.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/list", photoController.getAllPhoto);

router.post("/photos", photoController.createPhoto);

export default router;
