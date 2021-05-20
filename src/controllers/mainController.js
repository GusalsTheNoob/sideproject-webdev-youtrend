export const getHome = (req, res) => {
    return res.status(200).render("home");
}

export const postHome = async (req, res) => {
    // Request verification
    const baseURL = "https://accounts.google.com/o/oauth2/auth";
    const requestParams = {
        client_id: process.env.OAUTH_CLIENT_ID,
        redirect_uri: "http://localhost:4000",
        response_type: "code",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        access_type: "online",
    };
    const targetUrl = `${baseURL}?${new URLSearchParams(requestParams).toString()}`;
    console.log(targetUrl);
    return res.redirect(targetUrl);

    // Just for beauty
    return res.status(200).send("Working");
};