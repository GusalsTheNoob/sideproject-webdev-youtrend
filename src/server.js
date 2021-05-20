import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import flash from "express-flash";
import morgan from "morgan";
import mainRouter from "./routers/mainRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: process.env.COOKIE_SECRET, // need configuration
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    })
);
app.use(flash());
app.use("/", mainRouter);
app.use("/static", express.static("assets"));

export default app;