import { Date, Document, Model, Types } from "mongoose";

export interface IIdUser {
  _id: string;
}

export default interface IPhoto {
  image: string;
  title: string;
  desc: string;
  status: boolean;
  deleted: boolean;
  like: Array<IIdUser>;
  user: Types.ObjectId;
}
