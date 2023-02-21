import mongoose, { Schema } from "mongoose";

const PhotoSchema: Schema = new Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    status: { type: Boolean, required: true },
    like: { type: Array },
    userEmail: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Photo', PhotoSchema);
