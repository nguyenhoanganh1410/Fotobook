import { Date, Document, Types, Model } from "mongoose";

export interface IIdUser {
  _id: string;
}
// Subdocument definition
export interface image {
  _id: Types.ObjectId;
  url: string;
}

// Document definition
export interface IAlbum {
  images: image[];
  title: string;
  desc: string;
  status: boolean;
  deleted: boolean;
  like: Array<IIdUser>;
  userEmail: string;
}
