import express from "express";
import { getHome, postHome } from "../controllers/mainController";

const mainRouter = express.Router();

mainRouter.route("/").get(getHome).post(postHome);

export default mainRouter;