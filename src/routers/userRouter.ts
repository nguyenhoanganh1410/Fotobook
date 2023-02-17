import express from 'express';
import controller from '../controllers/userController';

const router = express.Router();

router.get('/:email', controller.getUserByEmail);
router.get('/', controller.getAllUser);
router.post('/signup', controller.createUser);

export = router;