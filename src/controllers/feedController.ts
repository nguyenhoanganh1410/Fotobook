import { log } from "console";
import { NextFunction, Request, Response } from "express";
import Photo from "../model/photo";

interface Query {
  page: string;
  limit: string;
  type: string;
}

// [GET] /feeds?type=photo&page=1&limit=3
const getData = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, type } = req.query as unknown as Query;

  //featch data is photo
  if (page && type === "photo") {
    const newPage = parseInt(page);
    const newLimit = parseInt(limit);
    const skip = (newPage - 1) * newLimit;
    try {
      // const list = await Photo.find({ status: true })
      //   .sort({ createdAt: -1 })
      //   .skip(skip)
      //   .limit(newLimit)
      //   .exec();
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

      const listRoot = await Photo.find().exec();
      res.render("pages/feed", {
        title: "FotoBook",
        user: req.user,
        data: list,
        currentPage: newPage,
        totalPage: Math.ceil(listRoot.length / newLimit),
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
};
// const getData = async (req: Request, res: Response, next: NextFunction) => {
//   const { page, limit, type } = req.query as unknown as Query;

//   //featch data is photo
//   if (page && type === "photo") {
//     const newPage = parseInt(page);
//     const newLimit = parseInt(limit);
//     const skip = (newPage - 1) * newLimit;
//     photo.getAllPhotos(skip, newLimit)
//   }
// };
export default { getData };
