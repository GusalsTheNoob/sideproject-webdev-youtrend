import mongoose from "mongoose";

const accessTokenSchema = mongoose.Schema({
    token: { type: String, required: true },
    expires_at: { type: Date, required: true }
})

const userSchema = mongoose.Schema({
    channelId: { type: String, required: true, unique: true },
    accessToken: { type: accessTokenSchema, required: true },
    refreshToken: { type: String, required: true },
    channelName: { type: String, required: true },
    channelThumbnailUrl: { type: String }
});

const User = mongoose.model("User", userSchema);
export default User;