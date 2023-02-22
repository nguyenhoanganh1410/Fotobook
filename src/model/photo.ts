import mongoose, { Schema, SchemaDefinition } from "mongoose";
import IPhoto, { IIdUser, PhotoModel } from "../interface/photo";

const PhotoSchema: Schema = new Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    status: { type: Boolean, required: true },
  
    userEmail: { type: String, require: true },
    like: [{
      label: {type: String, required: true},
      value: {type: Number, required: true}, // Type error, Number !== String
    } as SchemaDefinition<IIdUser>],
  },
  {
    timestamps: true,
  }
);

const photo = mongoose.model<IPhoto>("Photo", PhotoSchema);

// PhotoSchema.statics.getAllPhotos = async function (
//   skip: number,
//   limit: number
// ) {
//   const photos = await photo.aggregate([
//     {
//       /**
//        * query: The query in MQL.
//        */
//       $match: {
//         status: true,
//       },
//     },
//     {
//       /**
//        * Provide any number of field/order pairs.
//        */
//       $sort: {
//         createdAt: 1,
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "userEmail",
//         foreignField: "email",
//         as: "user",
//       },
//     },
//     { $unwind: "$user" },
//     {
//       $project: {
//         image: 1,
//         title: 1,
//         desc: 1,
//         status: 1,
//         createdAt: 1,
//         like: 1,
//         _id: 1,
//         "user.lastName": 1,
//         "user.email": 1,
//         "user.avatar": 1,
//         "user.firstName": 1,
//       },
//     },
//     {
//       $skip: skip,
//     },
//     {
//       $limit: limit,
//     },
//   ]);

//   return photos;
// };
export default mongoose.model<IPhoto>("Photo", PhotoSchema);;
