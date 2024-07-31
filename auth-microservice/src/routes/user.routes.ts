import { Router } from "express";
import { registerUser } from "../controllers/userController/user.register";
import { loginUser } from "../controllers/userController/user.login";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { currentUser } from "../controllers/userController/user.currentUser";
import { authenticateCurrentUser } from "../controllers/userController/user.authenticatePlayer";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/current-user").get(isLoggedIn, currentUser);
userRouter.route("/authenticate-user").post(authenticateCurrentUser);

export { userRouter };
