import express from "express";

const userRouter = express.Router();

userRouter.route("/").get((req, res) => { return res.send("Success! This will be a dashboard.") });

export default userRouter;