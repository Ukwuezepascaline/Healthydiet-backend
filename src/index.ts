import "dotenv/config";
import "module-alias/register";
import App from "./app";
import { validateEnv } from "@/utils/index";
import UserController from "@/resources/user/user.controller";
import SessionController from "@/resources/session/session.controller";
import BlogController from "@/resources/blog/blog.controller";

validateEnv();

const app = new App(
  [new UserController(), new SessionController(), new BlogController()],
  Number(process.env.PORT)
);
app.listen();
