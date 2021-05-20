import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    channelId: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    channelName: { type: String, required: true },
    channelThumbnailUrl: { type: String }
});

const User = mongoose.model("User", userSchema);
export default User;