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
    return res.redirect(targetUrl); 
};

export const getAuthSuccess = async (req, res) => {
    // Disect Response
    const {
        code,
        error
    } = req.query;
    if (error) {
        console.log(error);
        // Failure
        req.flash("error", "❌ Authorization Error");
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
        req.flash("error", "❌ Access Token Request Error");
        return res.status(500).redirect("/");
    }
    // Disect Response
    const {
        access_token,
        refresh_token,
        error: tokenError,
    } = tokenResponse;
    if (tokenError) {
        console.log(tokenError);
        // Failure
        req.flash("error", "❌ Access Token Request Error");
        return res.status(500).redirect("/");
    }
    // Success
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
            req.flash("error", "❌ User DB Creation Error");
            console.log(error);
            return res.status(500).redirect("/");
        }
    } else {
        currentUser = userResponse[0];
    }
    // 2. session change
    req.session.loggedIn = true;
    req.session.user = currentUser;
    req.flash("info", "✔️ Log In Successful!");
    return res.status(200).redirect("/user");
};

export const getLogout = (req, res) => {
    req.session.destroy();
    return res.status(200).redirect("/");
}