import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  imageUrl?: string;
  profileUrl?: string;
  channelId: string;
  createdAt: Date;
  updatedAt: Date;
  youtube?: {
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
  };
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    imageUrl: { type: String },
    profileUrl: { type: String },
    channelId: { type: String },
    youtube: {
      accessToken: { type: String },
      refreshToken: { type: String },
      expiryDate: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
