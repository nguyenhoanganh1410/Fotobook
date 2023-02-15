import express from 'express';
import controller from '../controllers/PhotoController';

const router = express.Router();


router.get('/test', controller.testController);

export = router;