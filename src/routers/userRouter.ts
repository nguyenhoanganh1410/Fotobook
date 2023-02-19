import express from 'express';
import passport from 'passport';
import controller from '../controllers/userController';
const router = express.Router();


router.get('/', controller.getAllUser);
router.post('/', controller.createUser);
router.post('/login',passport.authenticate('local', {
    successRedirect: '/feeds',
    failureRedirect: '/login'
}), (req, res) => {
    try {
        res.send("login sucessfull")
    } catch (error) {
        res.send("login fail")
    }
});


export = router;