import express from "express";
import { getUser } from "../controllers/userController";
import { protectorMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/").all(protectorMiddleware).get(getUser);

export default userRouter;