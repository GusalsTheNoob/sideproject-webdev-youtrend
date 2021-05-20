import express from "express";
import { getHome, postHome, getAuthSuccess, getLogout } from "../controllers/mainController";

const mainRouter = express.Router();

mainRouter.route("/").get(getHome).post(postHome);
mainRouter.route("/auth-success").get(getAuthSuccess);
mainRouter.route("/logout").get(getLogout);

export default mainRouter;