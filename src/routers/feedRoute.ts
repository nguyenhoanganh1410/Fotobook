import express, { Express, Request, Response, NextFunction } from 'express';
import passport from 'passport';
const router = express.Router();

// [GET] /feeds/
// home page - authorized
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    if(req.isAuthenticated()){
        res.send("home auth")
    }else{
        res.redirect("/login")
        // res.render('pages/login' ,{ title: 'FotoBook Login' })
    }
})


export = router;