import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const db = mongoose.connection;

const handleError = (error) => { console.log("❌ DB Initial Connection Error", error); }
const handleOpen = (error) => { console.log("✔️ Connected to the DB!") }

db.on("error", handleError);
db.once("open", handleOpen);