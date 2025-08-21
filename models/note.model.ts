import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  userId: Types.ObjectId;    // reference to User
  videoId: string;         // YouTube video ID
  content: string;         // note content
  tags: string[];          // array of tags
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    videoId: { type: String, required: true }, // YouTube video ID
    content: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Compound index for fast querying by user + video
NoteSchema.index({ userId: 1, videoId: 1 });

export default mongoose.models.Note ||
  mongoose.model<INote>("Note", NoteSchema);
