import express, { Express, Request, Response, NextFunction } from 'express';
const router = express.Router();
import authRoute from './auth'
import userRoute from './userRouter'
import feedRoute from './feedRoute'
function route(app: Express, passport : any){

    app.use('/', authRoute);
    app.use('/users', userRoute);
    app.use('/feeds', feedRoute);
}

export default route;