module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/product/post");
};

module.exports.catchAsync = function (fn) {
    return function (req, res, next) {
        fn(req, res).catch(err => {
            res.render("../views/error.ejs", { err });
        });
    }
};