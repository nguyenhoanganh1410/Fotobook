import mongoose, { Schema, SchemaDefinition } from "mongoose";
import IPhoto, { IIdUser, PhotoModel } from "../interface/photo";

const PhotoSchema: Schema = new Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    status: { type: Boolean, required: true },
    deleted: { type: Boolean, required: true },
    userEmail: { type: String, require: true },
    like: [
      {
        label: { type: String, required: true },
        value: { type: Number, required: true }, // Type error, Number !== String
      } as SchemaDefinition<IIdUser>,
    ],
  },
  {
    timestamps: true,
  }
);

const photo = mongoose.model<IPhoto>("Photo", PhotoSchema);

export default mongoose.model<IPhoto>("Photo", PhotoSchema);
