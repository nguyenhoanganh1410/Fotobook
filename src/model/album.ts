import { Model, Types, Schema, SchemaDefinition, model } from "mongoose";
import { IAlbum, IIdUser, image } from "../interface/album";

// TMethodsAndOverrides
type AlbumDocumentProps = {
  images: Types.DocumentArray<image>;
};
type AlbumModelType = Model<IAlbum, {}, AlbumDocumentProps>;

const AlbumSchema = new Schema<IAlbum, AlbumModelType>(
  {
    title: { type: String, required: true, lowercase: true, trim: true },
    desc: { type: String, required: true, lowercase: true, trim: true },
    status: { type: Boolean, required: true },
    deleted: { type: Boolean, required: true },
    userEmail: { type: String, require: true },
    images: [new Schema<image>({ url: String })],
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

// Create model
const Album = model<IAlbum, AlbumModelType>("Album", AlbumSchema);
export default Album;
