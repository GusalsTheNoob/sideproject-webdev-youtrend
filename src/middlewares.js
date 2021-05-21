export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "YouTrend";
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.user = req.session.user;
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
      return next();
    } else {
      req.flash("error", "❌ 먼저 로그인하세요.");
      return res.redirect("/");
    }
};
  
  export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
      return next();
    } else {
      req.flash("error", "❌ 잘못된 접근입니다.");
      return res.redirect("/");
    }
};