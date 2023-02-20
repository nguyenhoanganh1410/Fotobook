import express, { Express, Request, Response, NextFunction } from "express";
const router = express.Router();
import authRoute from "./auth";
import userRoute from "./userRouter";
import feedRoute from "./feedRoute";
import photoRoute from "./photoRouter";
function route(app: Express, passport: any) {
  app.use("/", authRoute);
  app.use("/users", userRoute);
  app.use("/feeds", feedRoute);
  app.use("/photos", photoRoute);
}

export default route;
