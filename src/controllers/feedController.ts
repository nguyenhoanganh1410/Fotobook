import { log } from "console";
import { NextFunction, Request, Response } from "express";
import Album from "../model/album";
import Photo from "../model/photo";

interface Query {
  page: string;
  limit: string;
  type: string;
}

// [GET] /feeds?type=xxx&page=1&limit=3
const getData = async (req: Request, res: Response, next: NextFunction) => {
  console.log("calal get data");
  const { page, limit, type } = req.query as unknown as Query;

  const newPage = parseInt(page);
  const newLimit = parseInt(limit);
  const skip = (newPage - 1) * newLimit;
  //featch data is photo
  if (type === "photo") {
    try {
      const list = await Photo.aggregate([
        {
          /**
           * query: The query in MQL.
           */
          $match: {
            status: true,
          },
        },
        {
          /**
           * query: The query in MQL.
           */
          $match: {
            deleted: false,
          },
        },
        {
          /**
           * Provide any number of field/order pairs.
           */
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userEmail",
            foreignField: "email",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            image: 1,
            title: 1,
            desc: 1,
            status: 1,
            createdAt: 1,
            like: 1,
            _id: 1,
            "user.lastName": 1,
            "user.email": 1,
            "user.avatar": 1,
            "user.firstName": 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: newLimit,
        },
      ]);

      const listRoot = await Photo.aggregate([
        {
          /**
           * query: The query in MQL.
           */
          $match: {
            status: true,
          },
        },
        {
          /**
           * query: The query in MQL.
           */
          $match: {
            deleted: false,
          },
        },
        {
          /**
           * Provide any number of field/order pairs.
           */
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userEmail",
            foreignField: "email",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            image: 1,
            title: 1,
            desc: 1,
            status: 1,
            createdAt: 1,
            like: 1,
            _id: 1,
            "user.lastName": 1,
            "user.email": 1,
            "user.avatar": 1,
            "user.firstName": 1,
          },
        },
      ]);
      res.render("pages/feed", {
        title: "FotoBook",
        user: req.user,
        data: list,
        currentPage: newPage,
        totalPage: Math.ceil(listRoot.length / newLimit),
        type,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  } else {
    //type is album
    try {
      const list = await Album.aggregate([
        {
          /**
           * query: The query in MQL.
           */
          $match: {
            status: true,
          },
        },
        {
          /**
           * query: The query in MQL.
           */
          $match: {
            deleted: false,
          },
        },
        {
          /**
           * Provide any number of field/order pairs.
           */
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userEmail",
            foreignField: "email",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            images: 1,
            title: 1,
            desc: 1,
            status: 1,
            createdAt: 1,
            like: 1,
            _id: 1,
            "user.lastName": 1,
            "user.email": 1,
            "user.avatar": 1,
            "user.firstName": 1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: newLimit,
        },
      ]);
      const listRoot = await Album.aggregate([
        {
          /**
           * query: The query in MQL.
           */
          $match: {
            status: true,
          },
        },
        {
          /**
           * query: The query in MQL.
           */
          $match: {
            deleted: false,
          },
        },
        {
          /**
           * Provide any number of field/order pairs.
           */
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userEmail",
            foreignField: "email",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            images: 1,
            title: 1,
            desc: 1,
            status: 1,
            createdAt: 1,
            like: 1,
            _id: 1,
            "user.lastName": 1,
            "user.email": 1,
            "user.avatar": 1,
            "user.firstName": 1,
          },
        },
      ]);

      res.render("pages/feed", {
        title: "FotoBook",
        user: req.user,
        data: list,
        currentPage: newPage,
        totalPage: Math.ceil(listRoot.length / newLimit),
        type,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
};

export default { getData };
