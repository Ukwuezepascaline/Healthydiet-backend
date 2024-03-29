import { Schema, model, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  imageUrl: string;
  overview: string;
  description: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  comments: Array<Schema.Types.ObjectId>;
  userId: Schema.Types.ObjectId;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    overview: { type: String, required: true },
    description: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: Array<{ type: Schema.Types.ObjectId; ref: "Comment" }>,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Blog = model<IBlog>("Blog", BlogSchema);
export default Blog;
