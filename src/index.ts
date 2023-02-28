import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import logging from "./config/logging/logging";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./config/db/config";
import route from "./routers/index";
import passport from "passport";
import session from "express-session";
import authenticateUser from "./service/passport";
import passportLocal from "passport-local";
import morgan from "morgan";
import multer from "multer";
var methodOverride = require("method-override");

dotenv.config();

const LocalStrategy = passportLocal.Strategy;
const app: Express = express();
const router = express();
const port = process.env.PORT || 9000;
const NAMESPACE = "Server";

const store = new session.MemoryStore();

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "hoanganh",
    cookie: {
      maxAge: 1000 * 20 * 10000,
    },
    store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

/** Connect to Mongo */
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    // console.log(result);
    logging.info(NAMESPACE, "Mongo Connected");
  })
  .catch((error) => {
    // console.log(error);
    logging.error(NAMESPACE, error.message, error);
  });

/** Error handling */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "file is too large",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "File limit reached",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "File must be an image",
      });
    }
  }
  res.status(404).json({
    message: error.message,
  });
});

// pug config
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

// static files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "uploads")));
//express > 4.16
app.use(express.json());

// override with POST having ?_method=PUT
app.use(methodOverride("_method"));

app.use(morgan("combined"));

/** Parse the body of the request */
app.use(bodyParser.urlencoded({ extended: true }));

// init route
route(app);

authenticateUser(passport);

app.use(router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
