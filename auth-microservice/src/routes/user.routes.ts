import { Router } from "express";
import { registerUser } from "../controllers/userController/user.register";
import { loginUser } from "../controllers/userController/user.login";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);

export { userRouter };
