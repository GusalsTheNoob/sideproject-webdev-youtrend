import express from "express";
import { getHome, postHome, getAuthSuccess } from "../controllers/mainController";

const mainRouter = express.Router();

mainRouter.route("/").get(getHome).post(postHome);
mainRouter.route("/auth-success").get(getAuthSuccess);

export default mainRouter;