import { createSlug, log } from "@/utils/index";
import {
  CreateBlogInterface,
  FetchBlogsInterface,
  UpdateBlogInterface,
} from "./blog.interface";
import Blog, { IBlog } from "./blog.model";
import Comment from "@/resources/comments/comment.model";
import { FilterQuery } from "mongoose";

class BlogService {
  private blogModel = Blog;
  private commentModel = Comment;

  public async createBlog(
    blogInput: CreateBlogInterface,
    userId: string
  ): Promise<IBlog | Error> {
    const { title, overview, description, imageUrl } = blogInput;

    const slug = createSlug(title);

    try {
      const blog = await this.blogModel.create({
        title,
        overview,
        imageUrl,
        description,
        slug,
        userId,
      });

      return blog;
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error creating blog");
    }
  }

  public async updateBlog(
    blogInput: UpdateBlogInterface["body"],
    blogId: string,
    userId: string
  ): Promise<IBlog | Error> {
    const { title, overview, imageUrl, description } = blogInput;

    try {
      const blog = await this.blogModel.findById(blogId);
      if (!blog) {
        throw new Error("Blog not found");
      }

      if (String(blog.userId) !== userId) {
        throw new Error("User not authorised");
      }

      const updatedBlog = await this.blogModel.findByIdAndUpdate(
        blogId,
        {
          title: title || blog.title,
          description: description || blog.description,
          imageUrl: imageUrl || blog.imageUrl,
          overview: overview || blog.overview,
        },
        { new: true }
      );

      return updatedBlog!;
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error updating blog");
    }
  }

  public async fetchBlog(slug: string): Promise<IBlog | Error> {
    try {
      const blog = await this.blogModel.findOne({ slug }).populate({
        path: "comments",
        model: this.commentModel,
      });
      if (!blog) {
        throw new Error("Blog not found");
      }

      return blog;
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error fetching blog");
    }
  }

  public async fetchBlogs(
    queryOptions: FetchBlogsInterface
  ): Promise<{ blogs: IBlog[]; numOfPages: number } | Error> {
    const { page, pageSize, searchQuery, filter } = queryOptions;

    try {
      // Design the filtering strategy
      const query: FilterQuery<typeof this.blogModel> = {};

      // Search for the searchQuery in the name, overview and description field
      if (searchQuery) {
        query.$or = [
          { name: { $regex: new RegExp(searchQuery, "i") } },
          { overview: { $regex: new RegExp(searchQuery, "i") } },
          { description: { $regex: new RegExp(searchQuery, "i") } },
        ];
      }

      let sortOptions = {};
      switch (filter) {
        case "newest":
          sortOptions = { createdAt: -1 };
          break;
        case "oldest":
          sortOptions = { createdAt: 1 };
          break;
        case "trending":
          sortOptions = { views: -1, likes: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
          break;
      }

      // Estimate the number of pages to skip based on the page number and size
      let numericPage = page ? Number(page) : 1; // Page number should default to 1
      let numericPageSize = pageSize ? Number(pageSize) : 10; // Page size should default to 10
      const skipAmount = (numericPage - 1) * numericPageSize;

      const blogs = await this.blogModel
        .find(query)
        .populate({
          path: "comments",
          model: this.commentModel,
        })
        .skip(skipAmount)
        .limit(numericPage)
        .sort(sortOptions);

      const totalBlogs = await this.blogModel.countDocuments(query);
      const numOfPages = Math.ceil(totalBlogs / numericPageSize);
      return { blogs, numOfPages };
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error fetching blogs");
    }
  }

  public async deleteBlog(
    blogId: string,
    userId: string
  ): Promise<string | Error> {
    try {
      const blog = await this.blogModel.findById(blogId);
      if (!blog) {
        throw new Error("Blog not found");
      }

      if (String(blog.userId) !== userId) {
        throw new Error("User not authorised");
      }

      await this.blogModel.findByIdAndDelete(blogId);
      return "Blog successfully deleted";
    } catch (e: any) {
      log.error(e.message);
      throw new Error(e.message || "Error deleting blog");
    }
  }
}

export default BlogService;
