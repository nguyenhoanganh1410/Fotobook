import express, { Express, Request, Response, NextFunction } from 'express';
import local_strategy from "passport-local"
import bcrypt from "bcryptjs"
import passport from 'passport';
const LocalStrategy = local_strategy.Strategy
const router = express.Router();


// //home page -> not login
// router.get('/',passport.authenticate('local', {
//          successRedirect:'/feeds',
//          failureRedirect:'/login'
//      }), (req: Request, res: Response, next: NextFunction) => {
//     res.send("home page")
// })
router.get('/login', (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/login' ,{ title: 'FotoBook' })
})
router.get('/signup', (req: Request, res: Response, next: NextFunction) => {
    res.render('pages/signup' ,{ title: 'FotoBook' })
})

export = router;