module.exports.isLoggedIn = (req, res, next) => {   

    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in to add a new listing");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirect){
    res.locals.redirectUrl = req.session.redirect;
}
next();

}