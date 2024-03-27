import { HttpException } from "@/utils/exceptions";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export default function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = res.locals.user;

  if (!user || user.userType !== "admin") {
    next(
      new HttpException(
        StatusCodes.UNAUTHORIZED,
        "You must be an admin to access this route"
      )
    );
  }

  next();
}
