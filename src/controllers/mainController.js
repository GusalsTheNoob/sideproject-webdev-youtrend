import fetch from "node-fetch";
import User from "../models/User";

export const getHome = (req, res) => {
    return res.status(200).render("home");
}

export const postHome = async (req, res) => {
    // Request verification
    const baseURL = "https://accounts.google.com/o/oauth2/auth";
    const requestParams = {
        client_id: process.env.OAUTH_CLIENT_ID,
        redirect_uri: "http://localhost:4000/auth-success",
        response_type: "code",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        access_type: "offline",
    };
    const targetUrl = `${baseURL}?${new URLSearchParams(requestParams).toString()}`;
    // console.log(targetUrl);
    return res.redirect(targetUrl); 
};

export const getAuthSuccess = async (req, res) => {
    // Disect Response
    const {
        code,
        error
    } = req.query;
    if (error) { // content: "access_denied"
        console.log(error);
        // Failure
        // TODO: flash message
        return res.status(500).redirect("/");
    }
    // Success
    // Request access/refresh token
    let tokenResponse;
    try {
        const tokenRequestParams = {
            code,
            client_id: process.env.OAUTH_CLIENT_ID,
            client_secret: process.env.OAUTH_CLIENT_SECRET,
            redirect_uri: "http://localhost:4000/auth-success",
            grant_type: "authorization_code"
        }
        tokenResponse = await (
            await fetch("https://accounts.google.com/o/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams(tokenRequestParams).toString(),
            })
        ).json();
    } catch (error) {
        console.log(error);
        // Failure
        // TODO: flash message
        return res.status(500).redirect("/");
    }
    console.log(tokenResponse);
    // Disect Response
    const {
        access_token,
        refresh_token,
        error: tokenError,
    } = tokenResponse;
    if (tokenError) {
        console.log(tokenError);
        // Failure
        // TODO: Flash Message
        return res.status(500).redirect("/");
    }
    // Success
    console.log(`access token: ${access_token}`);
    console.log(`refresh_token: ${refresh_token}`);
    // TEST: Getting the user's channel name
    let channelResponse;
    channelResponse = await (
        await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
    ).json();
    console.log(channelResponse.items[0]);
    // TEST ENDS HERE
    // 1. create or fetch user
    // 1-1. find whether this user has once already registered
    const {
        id: channelId,
        snippet: {
            title: channelName,
            thumbnails: {
                default: {
                    url: channelThumbnailUrl,
                }
            }
        }
    } = channelResponse.items[0];
    const userResponse = await User.find({ channelId });
    // console.log(userResponse);
    // 1-2. Or create a new one
    let currentUser;
    if (userResponse.length === 0) {
        try {
            currentUser = await User.create({
                channelId,
                accessToken: access_token,
                refreshToken: refresh_token,
                channelName,
                channelThumbnailUrl
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        currentUser = userResponse[0];
    }
    console.log(currentUser);
    // 1-3. And then get the user object 
    // 2. session change
    // 2-1. loggedIn
    // 2-2. User data
    return res.redirect("/user");
};