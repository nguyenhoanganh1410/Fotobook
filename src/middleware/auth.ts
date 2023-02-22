import express, { Express, Request, Response, NextFunction } from "express";

export const authUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    console.log("user is authenticated");
    next();
  } else {
    res.redirect("/login");
  }
};
