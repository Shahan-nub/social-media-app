import mongoose, { model, models, Schema } from "mongoose";
import { title } from "process";

export const PHOTO_DIMENSIONS = {
  width: 500,
  height: 500,
} as const;

export interface IPhoto {
  _id?: mongoose.Types.ObjectId;
  email?: string;
  title: string;
  description: string;
  photoUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const photoSchema = new Schema<IPhoto>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    email: {type: String, required: true},
    photoUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: PHOTO_DIMENSIONS.height },
      width: { type: Number, default: PHOTO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);

const Photo = models?.Photo || model<IPhoto>("Photo", photoSchema);

export default Photo;
