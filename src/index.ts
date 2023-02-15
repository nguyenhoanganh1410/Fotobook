import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import logging from './config/logging/logging';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config/db/config';
import route from './routers/index';
import photoRouter from './routers/PhotoRouter';
dotenv.config();

const app: Express = express();
const router = express();
const port = process.env.PORT || 8001;
const NAMESPACE = 'Server';

/** Connect to Mongo */
// mongoose
//     .connect(config.mongo.url, config.mongo.options)
//     .then((result) => {
//         logging.info(NAMESPACE, 'Mongo Connected');
//     })
//     .catch((error) => {
//      // console.log(error);
      
//         logging.error(NAMESPACE, error.message, error);
//     });


/** Log the request */
router.use((req, res, next) => {
 
  
  /** Log the req */
  logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

  res.on('finish', () => {
      /** Log the res */
      logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
  })
  
  next();
});


//pub config
app.set('view engine', 'pug')
app.set('views', `${__dirname}/views`)

//static files
app.use(express.static(path.join(__dirname, 'public')))

/** Parse the body of the request */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/home', (req: Request, res: Response, next: NextFunction) => {
  res.render('index' ,{ title: 'FotoBook' })
})

/** Error handling */
router.use((req, res, next) => {
  const error = new Error('Not found');

  res.status(404).json({
      message: error.message
  });
});


/** Routes go here */
router.use('/api', photoRouter);


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});