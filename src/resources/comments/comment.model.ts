import { Schema, model, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: Schema.Types.ObjectId;
  blog: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", CommentSchema);
export default Comment;
