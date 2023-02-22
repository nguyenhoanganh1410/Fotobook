import { Date, Document, Model } from "mongoose";

export interface IIdUser{
  _id: string;
}

export default interface IPhoto {
  image: string;
  title: string;
  desc: string;
  status: boolean;
  like: Array<IIdUser>;
  userEmail: string;
}

export interface PhotoModel extends Model<IPhoto> {
  getAllPhotos(): number;
}