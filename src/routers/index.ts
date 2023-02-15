import PhotoRouter from './PhotoRouter';
import express, { Express, Request, Response, NextFunction } from 'express';
function route(app: Express){
    //  app.get("/", (req, res) => {
    //     console.log(req.query.ref);
    //     res.render("home");
    //   });
      
      
    //   app.get("/search", (req, res) => {
    //     res.render("search");
    //   });
      
    //   app.post("/search", (req, res) => {
    //     console.log(req.body);
    //     res.render("search");
    //   });

 
      app.use('/photo', PhotoRouter);
}

export default route