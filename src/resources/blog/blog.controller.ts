import { Controller } from "@/utils/interfaces";
import { NextFunction, Request, Response, Router } from "express";
import BlogService from "./blog.service";
import isAdmin from "@/middlewares/is.admin.middleware";
import {
  CreateBlogInterface,
  FetchBlogInterface,
  UpdateBlogInterface,
} from "./blog.interface";
import { HttpException } from "@/utils/exceptions";
import { StatusCodes } from "http-status-codes";

class BlogController implements Controller {
  public path = "/blogs";
  public router = Router();
  public blogService = new BlogService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes = () => {
    this.router.post(`${this.path}/create`, [isAdmin], this.createBlog);
  };

  private createBlog = async (
    req: Request<{}, {}, CreateBlogInterface>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const blogInput = req.body;
    const { _id: userId } = res.locals.user;

    try {
      const blog = await this.blogService.createBlog(blogInput, userId);
      res.status(StatusCodes.CREATED).json(blog);
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
    }
  };

  private updateBlog = async (
    req: Request<
      UpdateBlogInterface["params"],
      {},
      UpdateBlogInterface["body"]
    >,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const blogInput = req.body;
    const { blogId } = req.params;
    const { _id: userId } = res.locals.user;

    try {
      const blog = await this.blogService.updateBlog(blogInput, blogId, userId);
      return res.status(StatusCodes.OK).json(blog);
    } catch (e: any) {
      if (e.message === "User not authorised") {
        next(new HttpException(StatusCodes.UNAUTHORIZED, e.message));
      } else {
        next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
      }
    }
  };

  private fetchBlog = async (
    req: Request<FetchBlogInterface>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { slug } = req.params;

    try {
      const blog = await this.blogService.fetchBlog(slug);
      res.status(StatusCodes.OK).json(blog);
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
    }
  };
}
