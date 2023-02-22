import express, { Express, Request, Response, NextFunction } from "express";
import authRoute from "./auth";
import userRoute from "./userRouter";
import feedRoute from "./feedRoute";
import photoRoute from "./photoRouter";

const router = express.Router();

function route(app: Express) {
  app.use("/users", userRoute);
  app.use("/feeds", feedRoute);
  app.use("/photos", photoRoute);
  app.use("/", authRoute);
}

export default route;
