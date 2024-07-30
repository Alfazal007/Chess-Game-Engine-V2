import { Router } from "express";
import { registerUser } from "../controllers/userController/user.register";

const userRouter = Router();

userRouter.route("/register").post(registerUser);

export { userRouter };
