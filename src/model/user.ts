import mongoose, { Schema } from "mongoose";
import logging from "../config/logging/logging";

import IUser from "../interface/user";

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, lowercase: true, trim: true },
    lastName: { type: String, required: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: Boolean, required: true },
    lastLogin: { type: Date },
    avatar: { type: String },
    role: { type: String, require: true },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.post<IUser>("save", function () {
  logging.info("Mongo", "Checkout the user: ", this);
});

export default mongoose.model<IUser>("User", UserSchema);
