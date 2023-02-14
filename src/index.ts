

import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

//pub config
app.set('view engine', 'pug')
app.set('views', `${__dirname}/views`)

//static files
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/home', (req: Request, res: Response, next: NextFunction) => {
  res.render('index' ,{ title: 'FotoBook' })
})


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});