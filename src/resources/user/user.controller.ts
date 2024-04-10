import { Router, Request, Response, NextFunction } from "express";
import UserService from "@/resources/user/user.service";
import {
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
  verifyUserSchema,
  updatePasswordSchema,
  fetchUsersSchema,
} from "@/resources/user/user.validation";
import {
  ForgotPasswordInterface,
  RegisterInterface,
  VerifyUserInterface,
  ResetPasswordInterface,
  UpdatePasswordInterface,
  fetchUsersInterface,
} from "@/resources/user/user.interface";
import { StatusCodes } from "http-status-codes";
import { loggedIn, validateResource } from "@/middlewares/index";
import { Controller } from "@/utils/interfaces";
import { HttpException } from "@/utils/exceptions";

class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.post(
      `${this.path}/register`,
      validateResource(registerSchema),
      this.register
    );

    this.router.get(
      `${this.path}/verify`,
      validateResource(verifyUserSchema),
      this.verify
    );

    this.router.post(
      `${this.path}/forgotPassword`,
      validateResource(forgotPasswordSchema),
      this.forgotPassword
    );

    this.router.post(
      `${this.path}/resetPassword`,
      validateResource(resetPasswordSchema),
      this.resetPassword
    );

    this.router.put(
      `${this.path}/updatePassword`,
      [loggedIn, validateResource(updatePasswordSchema)],
      this.updatePassword
    );

    this.router.get(
      `${this.path}`,
      [validateResource(fetchUsersSchema)],
      this.fetchUsers
    );
  }

  private register = async (
    req: Request<{}, {}, RegisterInterface>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const userInput = req.body;

    try {
      const message = await this.userService.register(userInput);
      res.status(StatusCodes.CREATED).json({ msg: message });
    } catch (e: any) {
      if ((e.message = "Account already exists")) {
        next(new HttpException(StatusCodes.CONFLICT, e.message));
      } else {
        next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
      }
    }
  };

  private verify = async (
    req: Request<{}, {}, {}, VerifyUserInterface>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const verificationInput = req.query;

    try {
      await this.userService.verify(verificationInput);
      //todo: Get the right redirect url following successful verification
      res.redirect(`${process.env.VERIFY_ACCOUNT_REDIRECT_URL}`);
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
    }
  };

  private forgotPassword = async (
    req: Request<{}, {}, ForgotPasswordInterface>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const forgotPasswordInput = req.body;

    try {
      const message =
        await this.userService.forgotPassword(forgotPasswordInput);
      res.status(StatusCodes.OK).json({ msg: message });
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
    }
  };

  private resetPassword = async (
    req: Request<
      {},
      {},
      ResetPasswordInterface["body"],
      ResetPasswordInterface["query"]
    >,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const resetPasswordQuery = req.query;
    const resetPasswordBody = req.body;

    try {
      await this.userService.resetPassword(
        resetPasswordQuery,
        resetPasswordBody
      );
      //todo: coordinate with the frontend team on the appropriate redirect url that will allow users to enter the new password
      res.redirect(`${process.env.VERIFY_ACCOUNT_REDIRECT_URL}`);
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
    }
  };

  private updatePassword = async (
    req: Request<{}, {}, UpdatePasswordInterface>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const updatePasswordInput = req.body;
    const { _id: userId } = res.locals.user;

    try {
      const message = await this.userService.updatePassword(
        updatePasswordInput,
        userId
      );
      res.status(StatusCodes.OK).json({ msg: message });
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
    }
  };

  private fetchUsers = async (
    req: Request<{}, {}, {}, fetchUsersInterface>,
    res: Response,
    next: NextFunction
  ): Promise<object | void> => {
    const queryOptions = req.query;

    try {
      const result = await this.userService.fetchUsers(queryOptions);
      res.status(StatusCodes.OK).json(result);
    } catch (e: any) {
      next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
    }
  };
}

export default UserController;
