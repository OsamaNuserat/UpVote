import connectDB from "../DB/connection.js";
import authRouter from "./Modules/Auth/auth.router.js";
import userRouter from "./Modules/User/user.router.js";
import postRouter from "./Modules/Post/post.router.js";
import { globalErrorHandler } from "./Services/ErrorHandling.js";
const initApp = (app, express) => {
  connectDB();
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/post", postRouter);
  app.use("/user", userRouter);
  app.use("*", (req, res) => {
    return res.json({ message: "page not found" });
  });

  // global error handling
  app.use(globalErrorHandler);
};

export default initApp;
