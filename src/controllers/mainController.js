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
        scope: "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.email",
        access_type: "offline",
    };
    const targetUrl = `${baseURL}?${new URLSearchParams(requestParams).toString()}`;
    return res.redirect(targetUrl); 
};

// helper functions for getAuthSuccess

export const requestInitialToken = async (code) => {
    const tokenRequestParams = {
        code,
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        redirect_uri: "http://localhost:4000/auth-success",
        grant_type: "authorization_code"
    }
    const tokenResponse = await (
        await fetch("https://accounts.google.com/o/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(tokenRequestParams).toString(),
        })
    ).json();
    return tokenResponse;
}

export const requestUserChannelInfo = async (access_token) => {
    const channelResponse = await (
        await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
    ).json();
    return channelResponse;
}

export const getAuthSuccess = async (req, res) => {
    // Disect Response
    const {
        code,
        error
    } = req.query;
    if (error) {
        console.log(error);
        req.flash("error", "❌ Goolge OAuth Error");
        return res.status(500).redirect("/");
    }
    // Request access/refresh token
    let tokenResponse;
    try {
        tokenResponse = await requestInitialToken(code);
    } catch (error) {
        console.log(error);
        req.flash("error", "❌ Access Token Request Error");
        return res.status(500).redirect("/");
    }
    // console.log(tokenResponse);
    // Disect Response
    const {
        access_token,
        refresh_token,
        expires_in,
        error: tokenError,
    } = tokenResponse;
    if (tokenError) {
        console.log(tokenError);
        req.flash("error", "❌ Access Token Request Error");
        return res.status(500).redirect("/");
    }
    // Getting the user's channel name
    let channelResponse;
    try {
        channelResponse = await requestUserChannelInfo(access_token);
    } catch (error) {
        console.log(error);
        req.flash("error", "❌ Channel Info Request Error");
        return res.status(500).redirect("/");
    }
    // create or fetch user
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
    let currentUser;
    try {
        const dataObj =  {
            channelId,
            accessToken: {
                token: access_token,
                expires_at: new Date(new Date().getTime() + (expires_in - 30) * 1000),
            },
            refreshToken: refresh_token,
            channelName,
            channelThumbnailUrl,
        };
        currentUser = await User.update({ channelId }, dataObj, { upsert: true });
    } catch (error) {
        req.flash("error", "❌ User DB Creation Error");
        console.log(error);
        return res.status(500).redirect("/");
    }
    // session change
    req.session.loggedIn = true;
    req.session.user = currentUser;
    req.flash("info", "✔️ Log In Successful!");
    return res.status(200).redirect("/user");
};

export const getLogout = (req, res) => {
    req.session.destroy();
    return res.status(200).redirect("/");
}