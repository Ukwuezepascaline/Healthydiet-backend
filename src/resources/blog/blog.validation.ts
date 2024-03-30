import { object, string, z } from "zod";

export const createBlogSchema = object({
  body: object({
    title: string({ required_error: "Title is required" }),
    imageUrl: string({ required_error: "Image Url is required" }),
    overview: string({ required_error: "Overview is required" }),
    description: string({ required_error: "Description is required" }),
  }),
});

export const updateBlogSchema = object({
  body: object({
    title: string().optional(),
    imageUrl: string().optional(),
    overview: string().optional(),
    description: string().optional(),
  }),
  params: object({
    blogId: string({ required_error: "Blog ID is required" }),
  }),
});

export const fetchBlogSchema = object({
  params: object({
    slug: string({ required_error: "Slug is required" }),
  }),
});

export const deleteBlogSchema = object({
  params: object({
    blogId: string({ required_error: "Blog ID is required" }),
  }),
});

export const fetchBlogsSchema = object({
  query: object({
    page: string().optional(),
    pageSize: string().optional(),
    searchQuery: string().optional(),
    filter: z.enum(["newest", "oldest", "trending"]).optional(),
  }),
});
