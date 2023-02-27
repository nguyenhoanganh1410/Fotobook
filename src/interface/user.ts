import { Date, Document, Types } from "mongoose";

export default interface IUser extends Document {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  password: string;
  status: boolean;
  lastLogin: Date;
  role: string;
  deleted: boolean;
}
