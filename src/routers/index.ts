import express, { Express, Request, Response, NextFunction } from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('pages/login' ,{ title: 'FotoBook' })
})

//register page
router.get('/signup', (req: Request, res: Response, next: NextFunction) => {
  res.render('pages/signup' ,{ title: 'FotoBook' })
})

//login page
router.get('/login', (req: Request, res: Response, next: NextFunction) => {
  res.render('pages/login' ,{ title: 'FotoBook' })
})

export default router;