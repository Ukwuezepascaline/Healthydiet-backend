import { Schema, model, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  imageUrl: string;
  overview: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
