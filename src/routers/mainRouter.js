import express from "express";
import { getHome } from "../controllers/mainController";

const mainRouter = express.Router();

mainRouter.route("/").get(getHome);

export default mainRouter;