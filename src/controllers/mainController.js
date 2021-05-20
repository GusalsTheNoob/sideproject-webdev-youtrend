import fetch from "node-fetch";

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
        access_type: "online",
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
        const requestParams = {
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
                body: new URLSearchParams(requestParams).toString(),
            })
        ).json();
    } catch (error) {
        console.log(error);
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
    return res.redirect("/user");
};