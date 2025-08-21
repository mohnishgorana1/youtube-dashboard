// models/Request.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  email: string;
  status: "pending" | "approved";
  createdAt: Date;
}

const RequestSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // so same email doesn’t request again
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Request ||
  mongoose.model<IRequest>("Request", RequestSchema);
