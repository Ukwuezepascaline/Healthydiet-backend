import { TypeOf } from "zod";
import {
  createBlogSchema,
  deleteBlogSchema,
  fetchBlogSchema,
  fetchBlogsSchema,
  updateBlogSchema,
} from "./blog.validation";

export type CreateBlogInterface = TypeOf<typeof createBlogSchema>["body"];
export type UpdateBlogInterface = TypeOf<typeof updateBlogSchema>;
export type FetchBlogInterface = TypeOf<typeof fetchBlogSchema>["params"];
export type DeleteBlogInterface = TypeOf<typeof deleteBlogSchema>["params"];
export type FetchBlogsInterface = TypeOf<typeof fetchBlogsSchema>["query"];
